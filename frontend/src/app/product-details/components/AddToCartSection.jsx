'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function AddToCartSection({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    if (!product?.inStock || isAdding) return;
    
    setIsAdding(true);
    if (onAddToCart) {
      await onAddToCart(product, quantity);
    }
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-card rounded-xl">
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="text-xs sm:text-sm font-medium text-text-primary">Quantity:</span>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-text-primary hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
          >
            <Icon name="MinusIcon" size={16} />
          </button>
          <span className="w-10 h-9 sm:w-12 sm:h-10 flex items-center justify-center text-sm font-medium text-text-primary border-x border-border">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-text-primary hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
          >
            <Icon name="PlusIcon" size={16} />
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!product?.inStock || isAdding}
        className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-micro flex items-center justify-center gap-2"
      >
        {isAdding ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Icon name="ShoppingCartIcon" size={20} />
            Add to Cart
          </>
        )}
      </button>

      <button className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-micro flex items-center justify-center gap-2">
        <Icon name="HeartIcon" size={20} />
        Add to Wishlist
      </button>

      <div className="pt-3 sm:pt-4 space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-text-secondary">
          <Icon name="TruckIcon" size={16} className="text-accent flex-shrink-0" />
          <span>Free delivery on orders above ₹499</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-text-secondary">
          <Icon name="ArrowPathIcon" size={16} className="text-accent flex-shrink-0" />
          <span>7 days easy return policy</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-text-secondary">
          <Icon name="ShieldCheckIcon" size={16} className="text-accent flex-shrink-0" />
          <span>100% secure payment</span>
        </div>
      </div>
    </div>
  );
}
