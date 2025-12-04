'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ImageGallery from './ImageGallery';
import ProductInfo from './ProductInfo';
import AddToCartSection from './AddToCartSection';

export default function ProductDetailsInteractive({ product }) {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(3);

  const breadcrumbItems = [
    { label: 'Shop', path: '/product-listing' },
    { label: product?.category || 'Products', path: `/product-listing?category=${product?.category}` },
    { label: product?.name || 'Product Details', path: '#' },
  ];

  const handleAddToCart = async (product, quantity) => {
    console.log('Adding to cart:', product.name, 'Qty:', quantity);
    setCartCount((prev) => prev + quantity);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} />
      <main className="pt-16">
        {/* Breadcrumb Section */}
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ImageGallery images={product?.images} />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <ProductInfo product={product} />
              <AddToCartSection product={product} onAddToCart={handleAddToCart} />
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: 'TruckIcon', label: 'Free Shipping' },
                  { icon: 'ArrowPathIcon', label: 'Easy Returns' },
                  { icon: 'ShieldCheckIcon', label: 'Secure Payment' },
                ].map((badge, index) => (
                  <div key={index} className="glass-card rounded-xl p-4 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-accent/10 rounded-lg flex items-center justify-center">
                      <span className="text-accent text-lg">✓</span>
                    </div>
                    <span className="text-xs text-text-secondary">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
