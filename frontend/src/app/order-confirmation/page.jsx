import OrderConfirmationInteractive from './components/OrderConfirmationInteractive';

export const metadata = {
  title: 'Order Confirmation | InventoryPredictor',
  description: 'Your order has been confirmed',
};

const orderData = {
  orderNumber: 'ORD-2024-78945',
  orderDate: 'December 4, 2024',
  status: 'confirmed',
  estimatedDelivery: 'Dec 10 - Dec 12, 2024',
  items: [
    {
      id: 'item-001',
      name: 'Apple iPhone 15 Pro Max (256GB) - Natural Titanium',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
      variant: 'Natural Titanium, 256GB',
      quantity: 1,
      price: 159900,
    },
    {
      id: 'item-002',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      variant: 'Black',
      quantity: 1,
      price: 29990,
    },
    {
      id: 'item-003',
      name: 'Nike Air Max 270 Running Shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      variant: 'Size: UK 9',
      quantity: 2,
      price: 25990,
    },
  ],
  subtotal: 215880,
  shipping: 0,
  tax: 38858,
  discount: 5000,
  total: 249738,
  shippingAddress: {
    name: 'Rahul Sharma',
    street: '123, Green Park Extension',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    country: 'India',
    phone: '+91 98765 43210',
  },
};

export default function OrderConfirmationPage() {
  return <OrderConfirmationInteractive orderData={orderData} />;
}
