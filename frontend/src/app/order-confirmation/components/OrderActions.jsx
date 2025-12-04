'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function OrderActions({ orderNumber }) {
  const handleTrackOrder = () => {
    console.log('Track order:', orderNumber);
  };

  const handleDownloadInvoice = () => {
    console.log('Download invoice:', orderNumber);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={handleTrackOrder}
        className="flex-1 py-3 px-4 text-sm font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-micro flex items-center justify-center gap-2"
      >
        <Icon name="MapIcon" size={18} />
        Track Order
      </button>
      <button
        onClick={handleDownloadInvoice}
        className="flex-1 py-3 px-4 text-sm font-semibold text-text-primary border border-border rounded-md hover:bg-muted transition-micro flex items-center justify-center gap-2"
      >
        <Icon name="DocumentArrowDownIcon" size={18} />
        Download Invoice
      </button>
      <Link
        href="/product-listing"
        className="flex-1 py-3 px-4 text-sm font-semibold text-accent border border-accent rounded-md hover:bg-accent hover:text-accent-foreground transition-micro flex items-center justify-center gap-2"
      >
        <Icon name="ShoppingBagIcon" size={18} />
        Continue Shopping
      </Link>
    </div>
  );
}
