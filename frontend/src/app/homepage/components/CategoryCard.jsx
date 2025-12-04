'use client';

import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      href={category?.link || `/product-listing?category=${category?.name?.toLowerCase()}`}
      className="group relative block overflow-hidden rounded-xl glass-card hover:shadow-lg hover:-translate-y-1 transition-smooth"
    >
      <div className="relative w-full h-40 md:h-48 overflow-hidden">
        <AppImage
          src={category?.image}
          alt={category?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-semibold text-background mb-1 font-heading">
          {category?.name}
        </h3>
        {category?.itemCount && (
          <p className="text-sm text-background/80">
            {category?.itemCount} Products
          </p>
        )}
      </div>
      <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-micro">
        <Icon name="ArrowRightIcon" size={16} className="text-text-primary" />
      </div>
    </Link>
  );
}
