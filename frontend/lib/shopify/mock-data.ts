// Mock data for demo mode (when Shopify credentials are not configured)
import { Cart, Collection, Menu, Page, Product } from './types';

export const mockProducts: Product[] = [
  {
    id: 'gid://shopify/Product/1',
    handle: 'classic-cotton-tshirt',
    availableForSale: true,
    title: 'Classic Cotton T-Shirt',
    description: 'A comfortable, everyday cotton t-shirt perfect for casual wear. Made from 100% organic cotton.',
    descriptionHtml: '<p>A comfortable, everyday cotton t-shirt perfect for casual wear. Made from 100% organic cotton.</p>',
    options: [
      { id: 'size', name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { id: 'color', name: 'Color', values: ['Black', 'White', 'Navy', 'Gray'] }
    ],
    priceRange: {
      maxVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      minVariantPrice: { amount: '29.99', currencyCode: 'USD' }
    },
    variants: [
      {
        id: 'gid://shopify/ProductVariant/1',
        title: 'S / Black',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Color', value: 'Black' }
        ],
        price: { amount: '29.99', currencyCode: 'USD' }
      },
      {
        id: 'gid://shopify/ProductVariant/2',
        title: 'M / Black',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Color', value: 'Black' }
        ],
        price: { amount: '29.99', currencyCode: 'USD' }
      }
    ],
    featuredImage: {
      url: 'https://placehold.co/800x800/1a1a1a/ffffff?text=T-Shirt',
      altText: 'Classic Cotton T-Shirt',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/1a1a1a/ffffff?text=T-Shirt',
        altText: 'Classic Cotton T-Shirt',
        width: 800,
        height: 800
      }
    ],
    seo: {
      title: 'Classic Cotton T-Shirt',
      description: 'A comfortable, everyday cotton t-shirt'
    },
    tags: ['apparel', 'tshirt', 'cotton'],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'gid://shopify/Product/2',
    handle: 'premium-denim-jeans',
    availableForSale: true,
    title: 'Premium Denim Jeans',
    description: 'High-quality denim jeans with a modern slim fit. Durable and stylish for any occasion.',
    descriptionHtml: '<p>High-quality denim jeans with a modern slim fit. Durable and stylish for any occasion.</p>',
    options: [
      { id: 'size', name: 'Size', values: ['28', '30', '32', '34', '36'] },
      { id: 'color', name: 'Color', values: ['Dark Blue', 'Light Blue', 'Black'] }
    ],
    priceRange: {
      maxVariantPrice: { amount: '89.99', currencyCode: 'USD' },
      minVariantPrice: { amount: '89.99', currencyCode: 'USD' }
    },
    variants: [
      {
        id: 'gid://shopify/ProductVariant/3',
        title: '32 / Dark Blue',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: '32' },
          { name: 'Color', value: 'Dark Blue' }
        ],
        price: { amount: '89.99', currencyCode: 'USD' }
      }
    ],
    featuredImage: {
      url: 'https://placehold.co/800x800/1e3a5f/ffffff?text=Jeans',
      altText: 'Premium Denim Jeans',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/1e3a5f/ffffff?text=Jeans',
        altText: 'Premium Denim Jeans',
        width: 800,
        height: 800
      }
    ],
    seo: {
      title: 'Premium Denim Jeans',
      description: 'High-quality denim jeans with a modern slim fit'
    },
    tags: ['apparel', 'jeans', 'denim'],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'gid://shopify/Product/3',
    handle: 'leather-crossbody-bag',
    availableForSale: true,
    title: 'Leather Crossbody Bag',
    description: 'Elegant leather crossbody bag with adjustable strap. Perfect for everyday use.',
    descriptionHtml: '<p>Elegant leather crossbody bag with adjustable strap. Perfect for everyday use.</p>',
    options: [
      { id: 'color', name: 'Color', values: ['Brown', 'Black', 'Tan'] }
    ],
    priceRange: {
      maxVariantPrice: { amount: '149.99', currencyCode: 'USD' },
      minVariantPrice: { amount: '149.99', currencyCode: 'USD' }
    },
    variants: [
      {
        id: 'gid://shopify/ProductVariant/4',
        title: 'Brown',
        availableForSale: true,
        selectedOptions: [
          { name: 'Color', value: 'Brown' }
        ],
        price: { amount: '149.99', currencyCode: 'USD' }
      }
    ],
    featuredImage: {
      url: 'https://placehold.co/800x800/8b4513/ffffff?text=Bag',
      altText: 'Leather Crossbody Bag',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/8b4513/ffffff?text=Bag',
        altText: 'Leather Crossbody Bag',
        width: 800,
        height: 800
      }
    ],
    seo: {
      title: 'Leather Crossbody Bag',
      description: 'Elegant leather crossbody bag'
    },
    tags: ['accessories', 'bag', 'leather'],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'gid://shopify/Product/4',
    handle: 'wireless-earbuds-pro',
    availableForSale: true,
    title: 'Wireless Earbuds Pro',
    description: 'Premium wireless earbuds with active noise cancellation and 24-hour battery life.',
    descriptionHtml: '<p>Premium wireless earbuds with active noise cancellation and 24-hour battery life.</p>',
    options: [
      { id: 'color', name: 'Color', values: ['White', 'Black'] }
    ],
    priceRange: {
      maxVariantPrice: { amount: '199.99', currencyCode: 'USD' },
      minVariantPrice: { amount: '199.99', currencyCode: 'USD' }
    },
    variants: [
      {
        id: 'gid://shopify/ProductVariant/5',
        title: 'White',
        availableForSale: true,
        selectedOptions: [
          { name: 'Color', value: 'White' }
        ],
        price: { amount: '199.99', currencyCode: 'USD' }
      }
    ],
    featuredImage: {
      url: 'https://placehold.co/800x800/333333/ffffff?text=Earbuds',
      altText: 'Wireless Earbuds Pro',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/333333/ffffff?text=Earbuds',
        altText: 'Wireless Earbuds Pro',
        width: 800,
        height: 800
      }
    ],
    seo: {
      title: 'Wireless Earbuds Pro',
      description: 'Premium wireless earbuds with ANC'
    },
    tags: ['electronics', 'audio', 'earbuds'],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'gid://shopify/Product/5',
    handle: 'running-sneakers',
    availableForSale: true,
    title: 'Running Sneakers',
    description: 'Lightweight running sneakers with superior cushioning and breathable mesh upper.',
    descriptionHtml: '<p>Lightweight running sneakers with superior cushioning and breathable mesh upper.</p>',
    options: [
      { id: 'size', name: 'Size', values: ['7', '8', '9', '10', '11', '12'] },
      { id: 'color', name: 'Color', values: ['Black/White', 'Blue/Gray', 'Red/Black'] }
    ],
    priceRange: {
      maxVariantPrice: { amount: '129.99', currencyCode: 'USD' },
      minVariantPrice: { amount: '129.99', currencyCode: 'USD' }
    },
    variants: [
      {
        id: 'gid://shopify/ProductVariant/6',
        title: '10 / Black/White',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: '10' },
          { name: 'Color', value: 'Black/White' }
        ],
        price: { amount: '129.99', currencyCode: 'USD' }
      }
    ],
    featuredImage: {
      url: 'https://placehold.co/800x800/2d2d2d/ffffff?text=Sneakers',
      altText: 'Running Sneakers',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/2d2d2d/ffffff?text=Sneakers',
        altText: 'Running Sneakers',
        width: 800,
        height: 800
      }
    ],
    seo: {
      title: 'Running Sneakers',
      description: 'Lightweight running sneakers'
    },
    tags: ['footwear', 'sneakers', 'running'],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'gid://shopify/Product/6',
    handle: 'smart-watch-elite',
    availableForSale: true,
    title: 'Smart Watch Elite',
    description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
    descriptionHtml: '<p>Advanced smartwatch with health monitoring, GPS, and 7-day battery life.</p>',
    options: [
      { id: 'color', name: 'Color', values: ['Space Gray', 'Silver', 'Rose Gold'] }
    ],
    priceRange: {
      maxVariantPrice: { amount: '349.99', currencyCode: 'USD' },
      minVariantPrice: { amount: '349.99', currencyCode: 'USD' }
    },
    variants: [
      {
        id: 'gid://shopify/ProductVariant/7',
        title: 'Space Gray',
        availableForSale: true,
        selectedOptions: [
          { name: 'Color', value: 'Space Gray' }
        ],
        price: { amount: '349.99', currencyCode: 'USD' }
      }
    ],
    featuredImage: {
      url: 'https://placehold.co/800x800/4a4a4a/ffffff?text=Watch',
      altText: 'Smart Watch Elite',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/4a4a4a/ffffff?text=Watch',
        altText: 'Smart Watch Elite',
        width: 800,
        height: 800
      }
    ],
    seo: {
      title: 'Smart Watch Elite',
      description: 'Advanced smartwatch with health monitoring'
    },
    tags: ['electronics', 'watch', 'smartwatch'],
    updatedAt: new Date().toISOString()
  }
];

export const mockCollections: Collection[] = [
  {
    handle: 'all',
    title: 'All Products',
    description: 'Browse our complete collection of products',
    seo: {
      title: 'All Products',
      description: 'Browse our complete collection'
    },
    updatedAt: new Date().toISOString(),
    path: '/search/all'
  },
  {
    handle: 'apparel',
    title: 'Apparel',
    description: 'Clothing and fashion items',
    seo: {
      title: 'Apparel',
      description: 'Clothing and fashion items'
    },
    updatedAt: new Date().toISOString(),
    path: '/search/apparel'
  },
  {
    handle: 'accessories',
    title: 'Accessories',
    description: 'Bags, watches, and more',
    seo: {
      title: 'Accessories',
      description: 'Bags, watches, and more'
    },
    updatedAt: new Date().toISOString(),
    path: '/search/accessories'
  },
  {
    handle: 'electronics',
    title: 'Electronics',
    description: 'Tech gadgets and devices',
    seo: {
      title: 'Electronics',
      description: 'Tech gadgets and devices'
    },
    updatedAt: new Date().toISOString(),
    path: '/search/electronics'
  },
  {
    handle: 'footwear',
    title: 'Footwear',
    description: 'Shoes and sneakers',
    seo: {
      title: 'Footwear',
      description: 'Shoes and sneakers'
    },
    updatedAt: new Date().toISOString(),
    path: '/search/footwear'
  }
];

export const mockMenus: { [key: string]: Menu[] } = {
  'next-js-frontend-header-menu': [
    { title: 'All', path: '/search' },
    { title: 'Apparel', path: '/search/apparel' },
    { title: 'Accessories', path: '/search/accessories' },
    { title: 'Electronics', path: '/search/electronics' },
    { title: 'Footwear', path: '/search/footwear' }
  ],
  'next-js-frontend-footer-menu': [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Terms & Conditions', path: '/terms-conditions' },
    { title: 'Privacy Policy', path: '/privacy-policy' }
  ]
};

export const mockPages: Page[] = [
  {
    id: '1',
    title: 'About',
    handle: 'about',
    body: '<h1>About Us</h1><p>Welcome to our demo store. This is a demonstration of the Vercel Commerce platform running in demo mode without a Shopify backend.</p>',
    bodySummary: 'Welcome to our demo store.',
    seo: { title: 'About Us', description: 'Learn more about our store' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Terms & Conditions',
    handle: 'terms-conditions',
    body: '<h1>Terms & Conditions</h1><p>These are sample terms and conditions for the demo store.</p>',
    bodySummary: 'Sample terms and conditions.',
    seo: { title: 'Terms & Conditions', description: 'Our terms and conditions' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Privacy Policy',
    handle: 'privacy-policy',
    body: '<h1>Privacy Policy</h1><p>This is a sample privacy policy for the demo store.</p>',
    bodySummary: 'Sample privacy policy.',
    seo: { title: 'Privacy Policy', description: 'Our privacy policy' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockCartData: Cart | null = null;

export function getMockCart(): Cart {
  if (!mockCartData) {
    mockCartData = {
      id: 'demo-cart-' + Date.now(),
      checkoutUrl: '/checkout',
      cost: {
        subtotalAmount: { amount: '0', currencyCode: 'USD' },
        totalAmount: { amount: '0', currencyCode: 'USD' },
        totalTaxAmount: { amount: '0', currencyCode: 'USD' }
      },
      lines: [],
      totalQuantity: 0
    };
  }
  return mockCartData;
}

export function updateMockCart(cart: Cart): Cart {
  mockCartData = cart;
  return cart;
}

export function getProductsByCollection(collection: string): Product[] {
  if (collection === 'all' || !collection) {
    return mockProducts;
  }
  return mockProducts.filter((p) => p.tags.includes(collection));
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}
