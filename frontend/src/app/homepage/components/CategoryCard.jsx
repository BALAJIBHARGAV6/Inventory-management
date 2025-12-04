'use client';

import Link from 'next/link';

export default function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      href={category?.link || `/product-listing?category=${category?.name?.toLowerCase()}`}
      className="group relative block overflow-hidden aspect-[4/5]"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url(${category?.image})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
      
      {/* Content - Centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        {/* Title */}
        <h3 className="text-lg md:text-xl font-light text-white tracking-widest uppercase">
          {category?.name}
        </h3>
        
        {/* Underline */}
        <div className="w-8 h-px bg-white/60 mt-4 group-hover:w-16 transition-all duration-500" />
      </div>
    </Link>
  );
}
