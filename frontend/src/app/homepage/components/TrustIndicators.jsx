'use client';

import Icon from '@/components/ui/AppIcon';

export default function TrustIndicators({ indicators = [] }) {
  const defaultIndicators = [
    {
      icon: 'TruckIcon',
      title: 'Free Shipping',
      description: 'On orders above ₹999',
    },
    {
      icon: 'ShieldCheckIcon',
      title: 'Secure Payment',
      description: '100% secure transactions',
    },
    {
      icon: 'ArrowPathIcon',
      title: 'Easy Returns',
      description: '7-day return policy',
    },
    {
      icon: 'ChatBubbleLeftRightIcon',
      title: '24/7 Support',
      description: 'Dedicated customer service',
    },
  ];

  const displayIndicators = indicators?.length > 0 ? indicators : defaultIndicators;

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {displayIndicators.map((indicator, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-smooth group"
            >
              <div className="w-16 h-16 mb-4 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-smooth">
                <Icon name={indicator?.icon} size={28} className="text-accent" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-1">
                {indicator?.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {indicator?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
