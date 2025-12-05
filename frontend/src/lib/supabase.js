import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug logging
console.log('Supabase URL configured:', !!supabaseUrl);
console.log('Supabase Key configured:', !!supabaseAnonKey);
console.log('Actual Supabase URL:', supabaseUrl);
console.log('URL Length:', supabaseUrl.length);

// Force demo mode for now - disable Supabase connection
const FORCE_DEMO_MODE = false;

// Check if Supabase is properly configured
const isSupabaseConfigured = !FORCE_DEMO_MODE && supabaseUrl && supabaseAnonKey && supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

let supabaseClient = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Handle auth errors gracefully
        onAuthStateChange: (event, session) => {
          if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed successfully');
          }
        },
      },
      global: {
        fetch: (...args) => {
          return fetch(...args).catch(err => {
            // Silently handle network errors for auth refresh
            if (err.message === 'Failed to fetch') {
              console.warn('Network error during Supabase request - continuing offline');
              return new Response(JSON.stringify({ error: 'Network error' }), { status: 503 });
            }
            throw err;
          });
        },
      },
    });
    console.log('Supabase client created successfully');
    
    // Clear corrupted sessions on startup
    if (typeof window !== 'undefined') {
      try {
        const storedSession = localStorage.getItem('sb-' + supabaseUrl.split('//')[1]?.split('.')[0] + '-auth-token');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          // Check if session is corrupted or expired
          if (!parsed?.access_token || !parsed?.refresh_token) {
            console.warn('Clearing corrupted Supabase session');
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('sb-') || key.includes('supabase')) {
                localStorage.removeItem(key);
              }
            });
          }
        }
      } catch (e) {
        // Clear on parse error
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    supabaseClient = null;
  }
} else {
  console.warn('Using demo mode - all authentication will be mocked');
}

export const supabase = supabaseClient;

// Mock authentication for when Supabase is not configured
const createMockUser = (email, fullName) => ({
  id: 'mock-user-' + Date.now(),
  email,
  user_metadata: { full_name: fullName },
  created_at: new Date().toISOString(),
});

// Auth helpers
export const signUp = async (email, password, fullName) => {
  if (!supabase) {
    // Mock successful signup when Supabase is not configured
    console.log('Demo Mode: Creating account for:', email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = createMockUser(email, fullName);
    
    // Store in localStorage for persistence
    localStorage.setItem('inventory_mock_user', JSON.stringify(mockUser));
    localStorage.setItem('inventory_demo_mode', 'true');
    
    console.log('Demo Mode: Account created successfully');
    
    return { 
      data: { user: mockUser },
      error: null
    };
  }
  
  try {
    // First, let's try a simple auth test
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    console.log('Supabase signup result:', { data: !!data, error: error?.message });
    console.log('Full error object:', error);
    console.log('User data:', data?.user);
    
    return { data, error };
  } catch (err) {
    console.error('SignUp error:', err);
    return { 
      data: null, 
      error: new Error('Failed to create account. Please check your connection and try again.') 
    };
  }
};

export const signIn = async (email, password) => {
  if (!supabase) {
    console.log('Demo Mode: Signing in:', email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock signin - check if user exists in localStorage
    const storedUser = localStorage.getItem('inventory_mock_user');
    if (storedUser) {
      const mockUser = JSON.parse(storedUser);
      if (mockUser.email === email) {
        console.log('Demo Mode: Existing user signed in');
        localStorage.setItem('inventory_demo_mode', 'true');
        return { 
          data: { user: mockUser },
          error: null
        };
      }
    }
    
    // Create new mock user if none exists
    const mockUser = createMockUser(email, 'Demo User');
    localStorage.setItem('inventory_mock_user', JSON.stringify(mockUser));
    localStorage.setItem('inventory_demo_mode', 'true');
    
    console.log('Demo Mode: New user created and signed in');
    
    return { 
      data: { user: mockUser },
      error: null
    };
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (err) {
    console.error('SignIn error:', err);
    return { 
      data: null, 
      error: new Error('Failed to sign in. Please check your connection and try again.') 
    };
  }
};

export const signOut = async () => {
  if (!supabase) {
    // Clear mock user from localStorage
    localStorage.removeItem('inventory_mock_user');
    console.log('Mock user signed out');
    return { error: null };
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    console.error('SignOut error:', err);
    return { error: null }; // Allow logout even on error
  }
};

export const getCurrentUser = async () => {
  if (!supabase) {
    // Check for mock user in localStorage
    const storedUser = localStorage.getItem('inventory_mock_user');
    if (storedUser) {
      try {
        const mockUser = JSON.parse(storedUser);
        return { user: mockUser, error: null };
      } catch (err) {
        localStorage.removeItem('inventory_mock_user');
      }
    }
    return { user: null, error: null };
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (err) {
    console.error('GetCurrentUser error:', err);
    return { user: null, error: null };
  }
};

export const getSession = async () => {
  if (!supabase) {
    return { session: null, error: null };
  }
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (err) {
    console.error('GetSession error:', err);
    return { session: null, error: null };
  }
};

// Fallback mock products when Supabase is not connected
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Apple iPhone 15 Pro Max 256GB',
    slug: 'iphone-15-pro-max',
    description: 'The most powerful iPhone ever with A17 Pro chip.',
    price: 159900,
    original_price: 179900,
    brand: 'Apple',
    category_id: '11111111-1111-1111-1111-111111111111',
    stock_quantity: 45,
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    rating: 4.8,
    review_count: 1250,
    is_featured: true,
    categories: { name: 'Electronics', slug: 'electronics' }
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    slug: 'samsung-s24-ultra',
    description: 'Ultimate productivity with S Pen and Galaxy AI.',
    price: 134999,
    original_price: 149999,
    brand: 'Samsung',
    category_id: '11111111-1111-1111-1111-111111111111',
    stock_quantity: 38,
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    rating: 4.7,
    review_count: 890,
    is_featured: true,
    categories: { name: 'Electronics', slug: 'electronics' }
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Headphones',
    slug: 'sony-wh1000xm5',
    description: 'Industry-leading noise cancellation.',
    price: 29990,
    original_price: 34990,
    brand: 'Sony',
    category_id: '11111111-1111-1111-1111-111111111111',
    stock_quantity: 72,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    rating: 4.7,
    review_count: 2100,
    is_featured: true,
    categories: { name: 'Electronics', slug: 'electronics' }
  },
  {
    id: '4',
    name: 'Apple MacBook Pro 14" M3 Pro',
    slug: 'macbook-pro-14-m3',
    description: 'Supercharged by M3 Pro chip.',
    price: 199900,
    original_price: 219900,
    brand: 'Apple',
    category_id: '11111111-1111-1111-1111-111111111111',
    stock_quantity: 22,
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    rating: 4.9,
    review_count: 560,
    is_featured: true,
    categories: { name: 'Electronics', slug: 'electronics' }
  },
  {
    id: '5',
    name: 'Nike Air Max 270 React',
    slug: 'nike-air-max-270',
    description: 'Maximum cushioning meets maximum style.',
    price: 12995,
    original_price: 14995,
    brand: 'Nike',
    category_id: '22222222-2222-2222-2222-222222222222',
    stock_quantity: 85,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    rating: 4.6,
    review_count: 750,
    is_featured: true,
    categories: { name: 'Fashion', slug: 'fashion' }
  },
  {
    id: '6',
    name: 'Apple AirPods Pro 2nd Gen',
    slug: 'airpods-pro-2',
    description: 'Rebuilt from the sound up with H2 chip.',
    price: 24900,
    original_price: 26900,
    brand: 'Apple',
    category_id: '11111111-1111-1111-1111-111111111111',
    stock_quantity: 120,
    thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
    rating: 4.7,
    review_count: 4500,
    is_featured: true,
    categories: { name: 'Electronics', slug: 'electronics' }
  },
  {
    id: '7',
    name: 'Sony PlayStation 5 Console',
    slug: 'playstation-5',
    description: 'Next-gen gaming with haptic feedback.',
    price: 49990,
    original_price: 54990,
    brand: 'Sony',
    category_id: '11111111-1111-1111-1111-111111111111',
    stock_quantity: 8,
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    rating: 4.9,
    review_count: 3200,
    is_featured: true,
    categories: { name: 'Electronics', slug: 'electronics' }
  },
  {
    id: '8',
    name: 'Adidas Ultraboost 23',
    slug: 'adidas-ultraboost-23',
    description: 'Incredible energy return with BOOST midsole.',
    price: 16999,
    original_price: 18999,
    brand: 'Adidas',
    category_id: '22222222-2222-2222-2222-222222222222',
    stock_quantity: 62,
    thumbnail: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400',
    rating: 4.6,
    review_count: 445,
    is_featured: true,
    categories: { name: 'Fashion', slug: 'fashion' }
  },
  {
    id: '9',
    name: 'Dyson V15 Detect Vacuum',
    slug: 'dyson-v15-detect',
    description: 'Reveal hidden dust with laser illumination.',
    price: 59990,
    original_price: 69990,
    brand: 'Dyson',
    category_id: '33333333-3333-3333-3333-333333333333',
    stock_quantity: 28,
    thumbnail: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
    rating: 4.4,
    review_count: 320,
    is_featured: true,
    categories: { name: 'Home & Living', slug: 'home-living' }
  },
  {
    id: '10',
    name: 'Levis 501 Original Jeans',
    slug: 'levis-501-original',
    description: 'The original blue jean since 1873.',
    price: 4999,
    original_price: 5999,
    brand: 'Levis',
    category_id: '22222222-2222-2222-2222-222222222222',
    stock_quantity: 150,
    thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    rating: 4.5,
    review_count: 890,
    is_featured: false,
    categories: { name: 'Fashion', slug: 'fashion' }
  },
];

const MOCK_CATEGORIES = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Electronics', slug: 'electronics', image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', is_active: true },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Fashion', slug: 'fashion', image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', is_active: true },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Home & Living', slug: 'home-living', image_url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400', is_active: true },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Sports', slug: 'sports', image_url: 'https://images.unsplash.com/photo-1461896836934-3f8b7e9d0e11?w=400', is_active: true },
];

// Products
export const getProducts = async (filters = {}) => {
  // Check if Supabase is configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Supabase not configured - using mock data');
    return { data: MOCK_PRODUCTS, error: null };
  }

  try {
    let query = supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_active', true);

    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.inStock) {
      query = query.gt('stock_quantity', 0);
    }
    if (filters.brand) {
      query = query.eq('brand', filters.brand);
    }
    if (filters.sortBy) {
      const [field, order] = filters.sortBy.split('-');
      query = query.order(field, { ascending: order === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    
    // If no data or error, return mock data
    if (error || !data || data.length === 0) {
      console.log('Supabase returned no data - using mock data');
      return { data: MOCK_PRODUCTS, error: null };
    }
    
    return { data, error };
  } catch (err) {
    console.log('Supabase error - using mock data:', err);
    return { data: MOCK_PRODUCTS, error: null };
  }
};

export const getProductById = async (id) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    return { data: product || null, error: null };
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('id', id)
      .single();
    if (error || !data) {
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      return { data: product || null, error: null };
    }
    return { data, error };
  } catch (err) {
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    return { data: product || null, error: null };
  }
};

export const getProductBySlug = async (slug) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    const product = MOCK_PRODUCTS.find(p => p.slug === slug);
    return { data: product || null, error: null };
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('slug', slug)
      .single();
    if (error || !data) {
      const product = MOCK_PRODUCTS.find(p => p.slug === slug);
      return { data: product || null, error: null };
    }
    return { data, error };
  } catch (err) {
    const product = MOCK_PRODUCTS.find(p => p.slug === slug);
    return { data: product || null, error: null };
  }
};

// Categories
export const getCategories = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { data: MOCK_CATEGORIES, error: null };
  }
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (error || !data || data.length === 0) {
      return { data: MOCK_CATEGORIES, error: null };
    }
    return { data, error };
  } catch (err) {
    return { data: MOCK_CATEGORIES, error: null };
  }
};

// Cart
export const getCart = async (userId) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', userId);
  return { data, error };
};

export const addToCart = async (userId, productId, quantity = 1) => {
  // Check if item exists in cart
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();
    return { data, error };
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: productId, quantity })
      .select()
      .single();
    return { data, error };
  }
};

export const updateCartItem = async (cartItemId, quantity) => {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .select()
    .single();
  return { data, error };
};

export const removeFromCart = async (cartItemId) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);
  return { error };
};

export const clearCart = async (userId) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);
  return { error };
};

// Orders
export const createOrder = async (orderData) => {
  if (!supabase) {
    console.error('Supabase not configured');
    return { data: null, error: new Error('Database not configured') };
  }
  
  try {
    console.log('Saving order to Supabase:', orderData);
    
    // Insert order into orders table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderData.order_number,
        user_id: orderData.user_id !== 'guest' ? orderData.user_id : null,
        status: orderData.status || 'pending',
        subtotal: orderData.subtotal,
        total: orderData.total,
        shipping_address: orderData.shipping_address,
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Supabase order insert error:', orderError);
      return { data: null, error: orderError };
    }
    
    console.log('Order saved to Supabase:', order);
    
    // Insert order items if order was created successfully
    if (order && orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        console.error('Order items insert error:', itemsError);
      } else {
        console.log('Order items saved successfully');
      }
    }
    
    return { data: order, error: null };
  } catch (err) {
    console.error('Order creation error:', err);
    return { data: null, error: err };
  }
};

export const createOrderItems = async (items) => {
  const { data, error } = await supabase
    .from('order_items')
    .insert(items)
    .select();
  return { data, error };
};

export const getOrders = async (userId) => {
  if (!supabase) {
    console.error('Supabase not configured');
    return { data: [], error: new Error('Database not configured') };
  }
  
  try {
    console.log('Fetching orders for user:', userId);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('GetOrders error:', error);
      return { data: [], error };
    }
    
    console.log('Orders fetched:', data);
    return { data: data || [], error: null };
  } catch (err) {
    console.error('GetOrders error:', err);
    return { data: [], error: err };
  }
};

export const getOrderById = async (orderId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('id', orderId)
    .single();
  return { data, error };
};

// User Profile
export const getUserProfile = async (userId) => {
  // First check localStorage for saved profile
  const localProfile = localStorage.getItem('inventory_user_profile');
  if (localProfile) {
    try {
      const parsed = JSON.parse(localProfile);
      if (parsed.id === userId) {
        // Return local profile immediately
        return { data: parsed, error: null };
      }
    } catch (e) {}
  }
  
  if (!supabase) {
    // Return mock profile for mock users
    if (userId && userId.startsWith('mock-user-')) {
      // Check if there's a saved mock profile
      const storedProfile = localStorage.getItem('inventory_mock_profile');
      if (storedProfile) {
        try {
          const mockProfile = JSON.parse(storedProfile);
          if (mockProfile.id === userId) {
            return { data: mockProfile, error: null };
          }
        } catch (e) {}
      }
      
      // Fall back to user data
      const storedUser = localStorage.getItem('inventory_mock_user');
      if (storedUser) {
        const mockUser = JSON.parse(storedUser);
        const mockProfile = {
          id: userId,
          user_id: userId,
          full_name: mockUser.user_metadata?.full_name || 'Demo User',
          phone: mockUser.user_metadata?.phone || '',
          address: mockUser.user_metadata?.address || '',
          email: mockUser.email,
          is_admin: false,
          created_at: mockUser.created_at
        };
        return { data: mockProfile, error: null };
      }
    }
    return { data: null, error: null };
  }
  
  try {
    // Try to get from Supabase with timeout
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve({ data: null, error: null }), 3000);
    });
    
    const fetchPromise = supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (data) {
      // Save to localStorage for future use
      localStorage.setItem('inventory_user_profile', JSON.stringify(data));
      return { data, error };
    }
    
    // If no data from Supabase, check localStorage
    if (localProfile) {
      return { data: JSON.parse(localProfile), error: null };
    }
    
    return { data: null, error };
  } catch (err) {
    console.error('GetUserProfile error:', err);
    // Return local profile on error
    if (localProfile) {
      return { data: JSON.parse(localProfile), error: null };
    }
    return { data: null, error: null };
  }
};

export const getFilterData = async () => {
  // Helper function to get filter data from products
  const getFilterDataFromProducts = (products) => {
    const categoryCount = {};
    const brandCount = {};
    
    products.forEach(product => {
      // Count categories
      const categoryName = product.categories?.name || product.category;
      if (categoryName) {
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      }
      
      // Count brands
      if (product.brand) {
        brandCount[product.brand] = (brandCount[product.brand] || 0) + 1;
      }
    });
    
    const categories = Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);

    const brands = Object.entries(brandCount).map(([name, count]) => ({
      name, 
      count
    })).sort((a, b) => b.count - a.count);

    return { categories, brands };
  };

  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey || !supabase) {
      console.log('Using mock products for filter data');
      return getFilterDataFromProducts(MOCK_PRODUCTS);
    }

    // Fetch products from database
    const { data: products, error } = await supabase
      .from('products')
      .select('brand, categories(name)')
      .eq('is_active', true);

    if (error || !products || products.length === 0) {
      console.log('No products from database, using mock data');
      return getFilterDataFromProducts(MOCK_PRODUCTS);
    }

    return getFilterDataFromProducts(products);
  } catch (error) {
    console.error('Error fetching filter data:', error);
    return getFilterDataFromProducts(MOCK_PRODUCTS);
  }
};

export const updateUserProfile = async (userId, profileData) => {
  // Always save to localStorage first as backup
  const localProfile = {
    id: userId,
    user_id: userId,
    full_name: profileData.full_name,
    phone: profileData.phone,
    address: profileData.address,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem('inventory_user_profile', JSON.stringify(localProfile));
  
  if (!supabase) {
    // For demo mode, update the mock user in localStorage
    console.log('Demo Mode: Updating profile for:', userId);
    
    try {
      const storedUser = localStorage.getItem('inventory_mock_user');
      if (storedUser) {
        const mockUser = JSON.parse(storedUser);
        mockUser.user_metadata = {
          ...mockUser.user_metadata,
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
        };
        localStorage.setItem('inventory_mock_user', JSON.stringify(mockUser));
        localStorage.setItem('inventory_mock_profile', JSON.stringify(localProfile));
        
        console.log('Demo Mode: Profile updated successfully');
        return { data: localProfile, error: null };
      }
      return { data: localProfile, error: null };
    } catch (err) {
      console.error('Demo Mode: Profile update error:', err);
      return { data: localProfile, error: null };
    }
  }
  
  try {
    // Update profile with timeout
    const updateData = {
      full_name: profileData.full_name,
      phone: profileData.phone || null,
      address: profileData.address || null,
      updated_at: new Date().toISOString(),
    };
    
    console.log('Updating profile for user:', userId);
    
    // Create a promise that rejects after 5 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), 5000);
    });
    
    // Race between the update and timeout
    const updatePromise = supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    try {
      const { data, error } = await Promise.race([updatePromise, timeoutPromise]);
      
      if (error) {
        console.error('Supabase update error:', error);
        // Return local data on error
        return { data: localProfile, error: null };
      }
      
      return { data: data || localProfile, error: null };
    } catch (raceErr) {
      // Timeout or other error - return local data
      console.log('Profile update timed out, using local storage');
      return { data: localProfile, error: null };
    }
  } catch (err) {
    console.error('UpdateUserProfile error:', err);
    // Return local data on any error
    return { data: localProfile, error: null };
  }
};

// Wishlist
export const getWishlist = async (userId) => {
  const { data, error } = await supabase
    .from('wishlist')
    .select('*, products(*)')
    .eq('user_id', userId);
  return { data, error };
};

export const addToWishlist = async (userId, productId) => {
  const { data, error } = await supabase
    .from('wishlist')
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();
  return { data, error };
};

export const removeFromWishlist = async (userId, productId) => {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  return { error };
};

// Reviews
export const getProductReviews = async (productId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createReview = async (reviewData) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData)
    .select()
    .single();
  return { data, error };
};

// Admin - Sales Analytics
export const getSalesAnalytics = async (startDate, endDate) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .eq('status', 'completed');
  return { data, error };
};

// Admin - Inventory
export const getInventoryStatus = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, stock_quantity, reorder_level, category_id, price')
    .order('stock_quantity', { ascending: true });
  return { data, error };
};

export const updateProductStock = async (productId, quantity) => {
  const { data, error } = await supabase
    .from('products')
    .update({ stock_quantity: quantity })
    .eq('id', productId)
    .select()
    .single();
  return { data, error };
};
