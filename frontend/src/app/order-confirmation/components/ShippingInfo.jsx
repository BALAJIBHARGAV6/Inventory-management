'use client';

import Icon from '@/components/ui/AppIcon';

export default function ShippingInfo({ address }) {
  if (!address) return null;

  return (
    <div className="bg-card rounded-md border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="MapPinIcon" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Shipping Address</h2>
      </div>
      <div className="text-sm text-text-secondary space-y-1">
        <p className="font-medium text-text-primary">{address?.name}</p>
        <p>{address?.street}</p>
        <p>{address?.city}, {address?.state} {address?.pincode}</p>
        <p>{address?.country}</p>
        <p className="pt-2">
          <span className="text-muted-foreground">Phone:</span> {address?.phone}
        </p>
      </div>
    </div>
  );
}
