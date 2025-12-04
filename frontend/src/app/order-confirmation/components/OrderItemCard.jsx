'use client';

import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function OrderItemCard({ item }) {
  if (!item) return null;

  return (
    <div className="flex gap-4 p-4 bg-card rounded-md border border-border">
      <div className="flex-shrink-0 w-20 h-20 bg-background rounded-md overflow-hidden">
        <AppImage
          src={item?.image}
          alt={item?.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-text-primary truncate mb-1">
          {item?.name}
        </h3>
        {item?.variant && (
          <p className="text-xs text-muted-foreground mb-1">{item?.variant}</p>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Qty: {item?.quantity}</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-semibold text-text-primary">
            ₹{item?.price?.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
