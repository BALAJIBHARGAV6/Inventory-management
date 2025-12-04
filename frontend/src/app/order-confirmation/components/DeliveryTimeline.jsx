'use client';

import Icon from '@/components/ui/AppIcon';

export default function DeliveryTimeline({ estimatedDelivery, currentStatus = 'confirmed' }) {
  const steps = [
    { id: 'confirmed', label: 'Order Confirmed', icon: 'CheckCircleIcon' },
    { id: 'processing', label: 'Processing', icon: 'CogIcon' },
    { id: 'shipped', label: 'Shipped', icon: 'TruckIcon' },
    { id: 'delivered', label: 'Delivered', icon: 'HomeIcon' },
  ];

  const currentIndex = steps.findIndex((s) => s.id === currentStatus);

  return (
    <div className="bg-card rounded-md border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Delivery Status</h2>
        <div className="text-sm text-muted-foreground">
          Est. Delivery: <span className="font-medium text-text-primary">{estimatedDelivery}</span>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                  } ${isCurrent ? 'ring-4 ring-success/20' : ''}`}
                >
                  <Icon name={step.icon} size={20} />
                </div>
                <span
                  className={`mt-2 text-xs text-center ${
                    isCompleted ? 'text-text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted -z-0">
          <div
            className="h-full bg-success transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
