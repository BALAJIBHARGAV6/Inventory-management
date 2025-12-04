'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      href={category?.link || `/product-listing?category=${category?.name?.toLowerCase()}`}
      className="group relative block overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
    >
      <div className="relative w-full h-44 md:h-56 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${category?.image})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-500">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform duration-300">
          {category?.name}
        </h3>
        {category?.itemCount >= 0 && (
          <p className="text-sm text-white/80 flex items-center gap-1">
            {category?.itemCount} Products
            <Icon name="ArrowRightIcon" size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </p>
        )}
      </div>
      
      {/* Corner Icon */}
      <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-45">
        <Icon name="ArrowUpRightIcon" size={18} className="text-white" />
      </div>
    </Link>
  );
}
