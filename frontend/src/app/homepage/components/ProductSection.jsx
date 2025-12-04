'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';
import Icon from '@/components/ui/AppIcon';

export default function ProductSection({ title, products = [], viewAllLink = '/product-listing' }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary font-heading">
            {title}
          </h2>
          <Link
            href={viewAllLink}
            className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-micro"
          >
            View All
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product?.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
