'use client';

import Icon from '@/components/ui/AppIcon';

export default function OrderSuccessHeader({ orderNumber, orderDate }) {
  return (
    <div className="text-center py-8 px-4 bg-success/10 rounded-lg mb-8">
      <div className="w-20 h-20 mx-auto mb-4 bg-success rounded-full flex items-center justify-center">
        <Icon name="CheckIcon" size={40} className="text-success-foreground" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2 font-heading">
        Order Confirmed!
      </h1>
      <p className="text-muted-foreground mb-4">
        Thank you for your purchase. Your order has been successfully placed.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Order Number:</span>
          <span className="font-semibold text-text-primary">{orderNumber}</span>
        </div>
        <span className="hidden sm:inline text-muted-foreground">•</span>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Order Date:</span>
          <span className="font-semibold text-text-primary">{orderDate}</span>
        </div>
      </div>
    </div>
  );
}
