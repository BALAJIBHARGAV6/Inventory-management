'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function OrderSummary({ 
  subtotal, 
  shipping, 
  tax, 
  discount,
  total,
  itemCount,
  onCheckout,
  isProcessing 
}) {
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = () => {
    if (!promoCode?.trim()) return;
    setIsApplyingPromo(true);
    setTimeout(() => setIsApplyingPromo(false), 1000);
  };

  return (
    <div className="bg-card rounded-md border border-border p-6 sticky top-20">
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        Order Summary
      </h2>
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="text-text-primary font-medium">
            ₹{subtotal?.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-text-primary font-medium">
            {shipping === 0 ? (
              <span className="text-success">FREE</span>
            ) : (
              `₹${shipping?.toLocaleString('en-IN')}`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tax (GST)</span>
          <span className="text-text-primary font-medium">
            ₹{tax?.toLocaleString('en-IN')}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-success font-medium">
              -₹{discount?.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>
      <div className="pt-4 mb-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-text-primary">
            Total
          </span>
          <span className="text-xl font-bold text-text-primary">
            ₹{total?.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e?.target?.value)}
            placeholder="Enter promo code"
            className="flex-1 h-10 px-3 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          />
          <button
            onClick={handleApplyPromo}
            disabled={isApplyingPromo || !promoCode?.trim()}
            className="px-4 h-10 text-sm font-medium text-primary-foreground bg-secondary rounded-md hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
          >
            {isApplyingPromo ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>
      <button
        onClick={onCheckout}
        disabled={isProcessing}
        className="w-full py-3 text-base font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-micro flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Proceed to Checkout
            <Icon name="ArrowRightIcon" size={20} />
          </>
        )}
      </button>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="ShieldCheckIcon" size={16} />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="TruckIcon" size={16} />
          <span>Free shipping on orders above ₹999</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="ArrowPathIcon" size={16} />
          <span>Easy 7-day returns & exchanges</span>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Link
          href="/product-listing"
          className="flex items-center justify-center gap-2 text-sm text-accent hover:text-accent/80 transition-micro"
        >
          <Icon name="ArrowLeftIcon" size={16} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
