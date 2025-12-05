'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import EmptyCart from './EmptyCart';

export default function ShoppingCartInteractive() {
  const router = useRouter();
  const { cart, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Remove breadcrumbs completely

  // Transform cart items for display
  const cartItems = cart.map(item => ({
    ...item,
    image: item.thumbnail || item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    imageAlt: item.name,
    variant: item.brand || '',
    originalPrice: item.originalPrice || item.original_price || item.price,
    maxStock: item.stock_quantity || 10,
    inStock: true,
    estimatedDelivery: 'Dec 15 - Dec 20',
  }));

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleSaveForLater = (itemId) => {
    console.log('Save for later:', itemId);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    router.push('/checkout');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 99; // Fixed delivery charge of ₹99
  const tax = 0; // Remove GST
  const discount = 0;
  const total = subtotal + shipping - discount;
  const itemCount = cartCount;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Luxury Hero Section */}
        <section className="relative py-16 md:py-20 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-700 to-transparent"></div>
            <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-700 to-transparent"></div>
            <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-700 to-transparent"></div>
          </div>
          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="h-px bg-neutral-300 dark:bg-neutral-700 w-16"></div>
                <div className="w-2 h-2 bg-neutral-900 dark:bg-white transform rotate-45"></div>
                <div className="h-px bg-neutral-300 dark:bg-neutral-700 w-16"></div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-neutral-900 dark:text-white mb-4 tracking-tight leading-none">
                Shopping Cart
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for checkout
              </p>
            </div>
          </div>
        </section>

        <div className="py-16 md:py-20 bg-white dark:bg-neutral-950">
          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12">
            {cartItems.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 lg:gap-16">
                <div className="xl:col-span-2">
                  <div className="space-y-8">
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

                <div className="xl:col-span-1">
                  <div className="sticky top-24">
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
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
