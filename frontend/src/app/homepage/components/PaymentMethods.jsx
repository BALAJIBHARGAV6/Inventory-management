'use client';

import Icon from '@/components/ui/AppIcon';

export default function PaymentMethods({ methods = [] }) {
  const defaultMethods = [
    { name: 'Visa', icon: 'CreditCardIcon' },
    { name: 'Mastercard', icon: 'CreditCardIcon' },
    { name: 'PayPal', icon: 'CreditCardIcon' },
    { name: 'UPI', icon: 'BanknotesIcon' },
    { name: 'Net Banking', icon: 'BuildingLibraryIcon' },
  ];

  const displayMethods = methods?.length > 0 ? methods : defaultMethods;

  return (
    <section className="py-8 border-t border-border">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground">We accept:</span>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {displayMethods.map((method, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md"
                title={method?.name}
              >
                <Icon name={method?.icon} size={20} className="text-text-secondary" />
                <span className="text-sm text-text-secondary">{method?.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
