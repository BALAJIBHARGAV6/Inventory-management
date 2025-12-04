import ShoppingCartInteractive from './components/ShoppingCartInteractive';

export const metadata = {
  title: 'Shopping Cart | InventoryPredictor',
  description: 'Review your cart items and proceed to checkout',
};

const initialCartItems = [
  {
    id: 'cart-001',
    name: 'Apple iPhone 15 Pro Max (256GB) - Natural Titanium',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
    imageAlt: 'iPhone 15 Pro Max',
    variant: 'Natural Titanium, 256GB',
    price: 159900,
    originalPrice: 179900,
    quantity: 1,
    maxStock: 5,
    inStock: true,
    estimatedDelivery: 'Dec 15 - Dec 18',
  },
  {
    id: 'cart-002',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    imageAlt: 'Sony Headphones',
    variant: 'Black',
    price: 29990,
    originalPrice: 34990,
    quantity: 1,
    maxStock: 10,
    inStock: true,
    estimatedDelivery: 'Dec 14 - Dec 16',
  },
  {
    id: 'cart-003',
    name: 'Nike Air Max 270 Running Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    imageAlt: 'Nike Shoes',
    variant: 'Size: UK 9',
    price: 12995,
    originalPrice: 14995,
    quantity: 2,
    maxStock: 8,
    inStock: true,
    estimatedDelivery: 'Dec 13 - Dec 15',
  },
];

export default function ShoppingCartPage() {
  return <ShoppingCartInteractive initialCartItems={initialCartItems} />;
}
