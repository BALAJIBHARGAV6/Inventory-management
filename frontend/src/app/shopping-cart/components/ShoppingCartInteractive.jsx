'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import EmptyCart from './EmptyCart';

export default function ShoppingCartInteractive({ initialCartItems = [] }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isProcessing, setIsProcessing] = useState(false);

  const breadcrumbItems = [
    { label: 'Shop', path: '/product-listing' },
    { label: 'Shopping Cart', path: '/shopping-cart' },
  ];

  const handleQuantityChange = async (itemId, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSaveForLater = (itemId) => {
    console.log('Save for later:', itemId);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push('/checkout-process');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const discount = 0;
  const total = subtotal + shipping + tax - discount;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={itemCount} />
      <main className="pt-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="text-2xl font-bold text-text-primary mb-6 font-heading">
                  Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </h1>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                      onSaveForLater={handleSaveForLater}
                    />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <OrderSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  discount={discount}
                  total={total}
                  itemCount={itemCount}
                  onCheckout={handleCheckout}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
