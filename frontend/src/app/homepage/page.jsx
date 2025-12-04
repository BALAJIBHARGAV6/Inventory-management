import { getProducts, getCategories } from '@/lib/supabase';
import HomepageInteractive from './components/HomepageInteractive';

export const metadata = {
  title: 'Home | InventoryPredictor',
  description: 'Welcome to InventoryPredictor - Your one-stop shop for quality products',
};

// Transform product for UI
function transformProduct(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.original_price || product.price,
    image: product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    alt: product.name,
    rating: product.rating || 0,
    reviewCount: product.review_count || 0,
    inStock: product.stock_quantity > 0,
  };
}

// Static data for UI elements
const staticData = {
  heroSlides: [
    {
      id: 1,
      title: 'Discover Premium Products',
      description: 'Shop the latest collection with exclusive deals up to 60% off. Free shipping on orders above ₹999.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&q=90',
      alt: 'Premium shopping experience',
      badge: 'Exclusive Deals',
      buttonText: 'Shop Now',
      link: '/product-listing',
    },
    {
      id: 2,
      title: 'Latest Tech Gadgets',
      description: 'Explore cutting-edge smartphones, laptops, and accessories. Best prices guaranteed.',
      image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1920&h=1080&fit=crop&q=90',
      alt: 'Electronics and gadgets',
      badge: 'New Arrivals',
      buttonText: 'Explore Tech',
      link: '/product-listing',
    },
    {
      id: 3,
      title: 'Fashion Forward',
      description: 'Elevate your style with our curated fashion collection. Trends that define you.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&q=90',
      alt: 'Fashion collection',
      badge: 'Trending Now',
      buttonText: 'View Collection',
      link: '/product-listing',
    },
  ],
  trustIndicators: [
    {
      icon: 'TruckIcon',
      title: 'Free Shipping',
      description: 'On orders above ₹999',
    },
    {
      icon: 'ShieldCheckIcon',
      title: 'Secure Payment',
      description: '100% secure transactions',
    },
    {
      icon: 'ArrowPathIcon',
      title: 'Easy Returns',
      description: '7-day return policy',
    },
    {
      icon: 'ChatBubbleLeftRightIcon',
      title: '24/7 Support',
      description: 'Dedicated customer service',
    },
  ],
  testimonials: [
    {
      name: 'Priya Sharma',
      location: 'Mumbai, India',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 5,
      content: 'Amazing shopping experience! The delivery was super fast and the product quality exceeded my expectations. Will definitely shop again.',
    },
    {
      name: 'Rahul Verma',
      location: 'Delhi, India',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 5,
      content: 'Great customer service and competitive prices. The return process was hassle-free when I needed to exchange a size.',
    },
    {
      name: 'Anita Desai',
      location: 'Bangalore, India',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      rating: 4,
      content: 'Love the variety of products available. The app is easy to use and the deals are genuinely good. Highly recommended!',
    },
  ],
  paymentMethods: [
    { name: 'Visa', icon: 'CreditCardIcon' },
    { name: 'Mastercard', icon: 'CreditCardIcon' },
    { name: 'PayPal', icon: 'CreditCardIcon' },
    { name: 'UPI', icon: 'BanknotesIcon' },
    { name: 'Net Banking', icon: 'BuildingLibraryIcon' },
  ],
};

export default async function Homepage() {
  // Fetch products and categories from Supabase
  const { data: products } = await getProducts();
  const { data: categories } = await getCategories();
  
  // Transform products for UI
  const allProducts = (products || []).map(transformProduct);
  
  // Get featured and new products
  const bestsellers = allProducts.filter(p => p.inStock).slice(0, 5);
  const newArrivals = allProducts.slice(-5).reverse();
  
  // Transform categories
  const categoryList = (categories || []).map(cat => ({
    name: cat.name,
    image: cat.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    itemCount: products?.filter(p => p.category_id === cat.id).length || 0,
    link: `/product-listing?category=${cat.slug}`,
  }));
  
  const pageData = {
    ...staticData,
    categories: categoryList,
    bestsellers,
    newArrivals,
  };
  
  return <HomepageInteractive pageData={pageData} />;
}
