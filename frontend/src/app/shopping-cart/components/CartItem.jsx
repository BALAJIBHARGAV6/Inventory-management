'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function CartItem({ item, onQuantityChange, onRemove, onSaveForLater }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > item?.maxStock) return;
    
    setIsUpdating(true);
    await onQuantityChange(item?.id, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleRemove = () => {
    onRemove(item?.id);
  };

  const handleSaveForLater = () => {
    onSaveForLater(item?.id);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-md border border-border hover:shadow-card transition-smooth">
      <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-background rounded-md overflow-hidden">
        <AppImage
          src={item?.image}
          alt={item?.imageAlt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text-primary truncate">
              {item?.name}
            </h3>
            {item?.variant && (
              <p className="text-sm text-muted-foreground mt-1">
                {item?.variant}
              </p>
            )}
            {item?.inStock ? (
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <Icon name="CheckCircleIcon" size={14} />
                In Stock
              </p>
            ) : (
              <p className="text-xs text-error mt-1 flex items-center gap-1">
                <Icon name="XCircleIcon" size={14} />
                Out of Stock
              </p>
            )}
          </div>

          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1 text-muted-foreground hover:text-error transition-micro"
            aria-label="Remove item"
          >
            <Icon name="TrashIcon" size={20} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <button
                onClick={() => handleQuantityChange(item?.quantity - 1)}
                disabled={isUpdating || item?.quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
                aria-label="Decrease quantity"
              >
                <Icon name="MinusIcon" size={16} />
              </button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-medium text-text-primary border-x border-border">
                {item?.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item?.quantity + 1)}
                disabled={isUpdating || item?.quantity >= item?.maxStock}
                className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
                aria-label="Increase quantity"
              >
                <Icon name="PlusIcon" size={16} />
              </button>
            </div>

            <button
              onClick={handleSaveForLater}
              className="text-sm text-accent hover:text-accent/80 transition-micro flex items-center gap-1"
            >
              <Icon name="BookmarkIcon" size={16} />
              <span className="hidden sm:inline">Save for Later</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {item?.originalPrice && item?.originalPrice > item?.price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{item?.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-lg font-bold text-text-primary">
              ₹{(item?.price * item?.quantity)?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {item?.estimatedDelivery && (
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <Icon name="TruckIcon" size={14} />
            Estimated delivery: {item?.estimatedDelivery}
          </p>
        )}
      </div>
    </div>
  );
}
