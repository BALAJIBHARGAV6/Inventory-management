'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import ImageGallery from './ImageGallery';
import ProductInfo from './ProductInfo';
import AddToCartSection from './AddToCartSection';
import Icon from '@/components/ui/AppIcon';

export default function ProductDetailsInteractive({ product }) {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(3);

  const breadcrumbItems = [
    { label: 'Products', path: '/product-listing' },
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
      <main className="pt-20 md:pt-24">
        {/* Breadcrumb Section */}
        <div className="bg-muted/30 py-3 border-b border-border">
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
                  { icon: 'TruckIcon', label: 'Free Shipping', desc: 'On orders above ₹999' },
                  { icon: 'ArrowPathIcon', label: 'Easy Returns', desc: '7 days return policy' },
                  { icon: 'ShieldCheckIcon', label: 'Secure Payment', desc: '100% secure checkout' },
                ].map((badge, index) => (
                  <div key={index} className="bg-gradient-to-br from-muted/50 to-muted border border-border rounded-2xl p-5 text-center hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl flex items-center justify-center">
                      <Icon name={badge.icon} size={24} className="text-accent" />
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary mb-1">{badge.label}</h4>
                    <span className="text-xs text-text-secondary">{badge.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Product Details Section */}
          <div className="mt-16 pt-12 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Specifications */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Icon name="ClipboardDocumentListIcon" size={20} className="text-accent" />
                  Specifications
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between text-sm">
                    <span className="text-text-secondary">Brand</span>
                    <span className="font-medium text-text-primary">Apple</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-text-secondary">Model</span>
                    <span className="font-medium text-text-primary">iPhone 15 Pro Max</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-text-secondary">Storage</span>
                    <span className="font-medium text-text-primary">256GB</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-text-secondary">Color</span>
                    <span className="font-medium text-text-primary">Natural Titanium</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-text-secondary">Warranty</span>
                    <span className="font-medium text-text-primary">1 Year</span>
                  </li>
                </ul>
              </div>

              {/* Delivery Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Icon name="TruckIcon" size={20} className="text-accent" />
                  Delivery Info
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="CheckIcon" size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Express Delivery</p>
                      <p className="text-xs text-text-secondary">Get it within 2-3 days</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="MapPinIcon" size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Pan India Delivery</p>
                      <p className="text-xs text-text-secondary">Available across all pincodes</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="GiftIcon" size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Gift Wrapping</p>
                      <p className="text-xs text-text-secondary">Available at checkout</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Customer Support */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-accent" />
                  Need Help?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="PhoneIcon" size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Call Us</p>
                      <p className="text-xs text-text-secondary">+91 98765 43210</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="EnvelopeIcon" size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Email Support</p>
                      <p className="text-xs text-text-secondary">inventorypredictor@gmail.com</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="ClockIcon" size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Working Hours</p>
                      <p className="text-xs text-text-secondary">Mon-Sat, 9AM - 6PM</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
