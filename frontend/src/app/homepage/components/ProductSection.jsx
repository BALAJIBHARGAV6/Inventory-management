'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';

export default function ProductSection({ title, subtitle, products = [], viewAllLink = '/product-listing' }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-neutral-950">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12">
        {/* Sophisticated Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px bg-neutral-300 dark:bg-neutral-700 w-12"></div>
            <div className="w-1 h-1 bg-neutral-900 dark:bg-white rotate-45"></div>
            <div className="h-px bg-neutral-300 dark:bg-neutral-700 w-12"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-thin text-neutral-900 dark:text-white mb-4 tracking-tight leading-none">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-light tracking-wide max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          
          <div className="mt-8">
            <Link
              href={viewAllLink}
              className="group inline-flex items-center gap-3 text-sm font-medium text-neutral-900 dark:text-white 
                hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-300"
            >
              <span className="tracking-wide">Explore Collection</span>
              <div className="w-6 h-px bg-current group-hover:w-12 transition-all duration-300"></div>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Premium 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-10 lg:gap-12">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product?.id} product={product} />
          ))}
        </div>

        {/* Bottom Accent */}
        <div className="flex justify-center mt-16 md:mt-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-px bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="w-1 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
            <div className="w-4 h-px bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="w-1 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
            <div className="w-2 h-px bg-neutral-300 dark:bg-neutral-700"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
