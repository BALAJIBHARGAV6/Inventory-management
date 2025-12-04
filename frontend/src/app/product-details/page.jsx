import ProductDetailsInteractive from './components/ProductDetailsInteractive';

export const metadata = {
  title: 'Product Details | InventoryPredictor',
  description: 'View product details and add to cart',
};

const productData = {
  id: 'prod-001',
  name: 'Apple iPhone 15 Pro Max (256GB) - Natural Titanium',
  price: 159900,
  originalPrice: 179900,
  rating: 4.8,
  reviewCount: 1250,
  inStock: true,
  badge: 'Bestseller',
  category: 'Electronics',
  description: 'iPhone 15 Pro Max features a strong and light aerospace-grade titanium design with a textured matte-glass back. It also features a Ceramic Shield front that\'s tougher than any smartphone glass. And it\'s splash, water, and dust resistant.',
  features: [
    'A17 Pro chip with 6-core GPU',
    '6.7-inch Super Retina XDR display with ProMotion',
    'Pro camera system with 48MP Main camera',
    'Action button for quick access',
    'USB-C with USB 3 speeds',
    'Up to 29 hours video playback',
  ],
  images: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop',
  ],
};

export default function ProductDetailsPage() {
  return <ProductDetailsInteractive product={productData} />;
}
