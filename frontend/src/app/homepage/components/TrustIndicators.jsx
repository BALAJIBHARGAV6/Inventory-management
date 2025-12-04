'use client';

const TRUST_FEATURES = [
  {
    title: 'Complimentary Shipping',
    description: 'On orders above ₹999',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: 'Secure Checkout',
    description: '100% protected payments',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Easy Returns',
    description: '7-day return policy',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: 'Premium Support',
    description: '24/7 dedicated care',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
];

export default function TrustIndicators() {
  return (
    <section className="py-12 md:py-16 bg-neutral-50 dark:bg-neutral-900/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-800 to-transparent"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-800 to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-800 to-transparent"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Elegant Header */}
        <div className="text-center mb-20 md:mb-24">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="h-px bg-neutral-300 dark:bg-neutral-700 w-16"></div>
            <div className="w-2 h-2 bg-neutral-900 dark:bg-white transform rotate-45"></div>
            <div className="h-px bg-neutral-300 dark:bg-neutral-700 w-16"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-thin text-neutral-900 dark:text-white tracking-tight leading-none">
            Our Commitment to Excellence
          </h2>
        </div>

        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {TRUST_FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group text-center relative"
            >
              {/* Icon Container */}
              <div className="inline-flex items-center justify-center w-16 h-16 mb-8 relative">
                <div className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-500"></div>
                <div className="relative text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-light text-neutral-900 dark:text-white tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent group-hover:via-neutral-900 dark:group-hover:via-white transition-colors duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
