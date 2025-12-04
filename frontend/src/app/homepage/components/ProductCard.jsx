'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function ProductCard({ product }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart || !product?.inStock) return;
    
    setIsAddingToCart(true);
    addToCart(product, 1);
    setTimeout(() => setIsAddingToCart(false), 800);
  };

  const discountPercentage = product?.originalPrice 
    ? Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100)
    : 0;

  return (
    <div className="group cursor-pointer">
      <Link href="/product-details" className="block">
        {/* Image Container - Perfect Rectangle */}
        <div className="relative aspect-[3/4] w-full mb-6 overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
          <img 
            src={product?.image}
            alt={product?.name}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Elegant Discount Label */}
          {discountPercentage > 0 && (
            <div className="absolute top-4 right-4">
              <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm px-3 py-1 shadow-lg">
                <span className="text-[11px] font-semibold tracking-wider text-neutral-900 dark:text-white">
                  SAVE {discountPercentage}%
                </span>
              </div>
            </div>
          )}

          {/* Premium Add Button */}
          {product?.inStock && (
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full py-4 bg-black/90 dark:bg-white/90 text-white dark:text-black backdrop-blur-sm 
                  text-sm font-medium tracking-wide hover:bg-black dark:hover:bg-white transition-all duration-300
                  shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ADDING TO BAG
                  </span>
                ) : (
                  'ADD TO BAG'
                )}
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Product Information - Refined Typography */}
      <div className="space-y-3">
        {/* Product Title */}
        <Link href="/product-details">
          <h3 className="text-[15px] font-normal text-neutral-900 dark:text-white leading-snug tracking-tight 
            group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors duration-300 line-clamp-2">
            {product?.name}
          </h3>
        </Link>

        {/* Rating & Reviews - Compact */}
        {product?.rating > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index < Math.floor(product?.rating) 
                      ? 'bg-neutral-900 dark:bg-white' 
                      : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-[12px] text-neutral-500 dark:text-neutral-400 font-medium">
              {product.rating} · {product?.reviewCount?.toLocaleString()} reviews
            </span>
          </div>
        )}

        {/* Price Section - Clean Hierarchy */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
              ₹{product?.price?.toLocaleString('en-IN')}
            </span>
            {product?.originalPrice && product?.originalPrice > product?.price && (
              <span className="text-sm text-neutral-400 dark:text-neutral-500 line-through font-normal">
                ₹{product?.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          
          {/* Quick Action Icon */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-900 dark:hover:bg-white 
              hover:text-white dark:hover:text-black transition-all duration-300 flex items-center justify-center
              opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
          >
            {isAddingToCart ? (
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
