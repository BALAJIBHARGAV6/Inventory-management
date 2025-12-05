'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function ProductCard({ product, onAddToCart, viewMode = 'grid' }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart || !product?.inStock) return;
    
    setIsAddingToCart(true);
    if (onAddToCart) {
      await onAddToCart(product);
    }
    setTimeout(() => setIsAddingToCart(false), 800);
  };

  const discountPercentage = product?.originalPrice 
    ? Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div className="group flex gap-6 bg-white dark:bg-neutral-950 p-6 border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow duration-300">
        <Link href={`/product-details/${product?.id}`} prefetch={true} className="flex-shrink-0">
          <div className="relative w-32 h-32 overflow-hidden bg-neutral-50 dark:bg-neutral-900">
            <AppImage
              src={product?.image}
              alt={product?.alt || product?.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {discountPercentage > 0 && (
              <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-medium">
                -{discountPercentage}%
              </span>
            )}
          </div>
        </Link>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Link href={`/product-details/${product?.id}`} prefetch={true}>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                {product?.name}
              </h3>
            </Link>
            
            {product?.rating > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
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
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {product.rating} ({product?.reviewCount?.toLocaleString()})
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-neutral-900 dark:text-white">
                ₹{product?.price?.toLocaleString('en-IN')}
              </span>
              {product?.originalPrice && product?.originalPrice > product?.price && (
                <span className="text-sm text-neutral-400 line-through">
                  ₹{product?.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            {product?.inStock && (
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="px-4 py-2 border border-neutral-900 dark:border-white text-neutral-900 dark:text-white text-sm font-medium hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors duration-300 disabled:opacity-50"
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="group relative border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:shadow-xl transition-all duration-500 ease-out">
      {/* Image Section */}
      <Link href={`/product-details/${product?.id}`} prefetch={true} className="block relative">
        <div className="relative aspect-square w-full overflow-hidden">
          <AppImage
            src={product?.image}
            alt={product?.alt || product?.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110"
          />
          
          {/* Elegant Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Minimal Discount Indicator */}
          {discountPercentage > 0 && (
            <div className="absolute top-0 left-0 bg-black dark:bg-white text-white dark:text-black px-4 py-2">
              <span className="text-xs font-medium tracking-[0.2em] uppercase">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* Sophisticated Add Button */}
          {product?.inStock && (
            <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full py-4 bg-white/95 dark:bg-neutral-900/95 text-neutral-900 dark:text-white backdrop-blur-lg border border-neutral-300 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-900 transition-all duration-300 font-medium tracking-wide text-sm disabled:opacity-50"
              >
                {isAddingToCart ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Adding to Collection
                  </span>
                ) : (
                  'Add to Collection'
                )}
              </button>
            </div>
          )}
          
          {/* Out of Stock Overlay */}
          {!product?.inStock && (
            <div className="absolute inset-0 bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center">
              <div className="text-center">
                <span className="text-sm font-light tracking-[0.3em] uppercase text-neutral-500 dark:text-neutral-400">
                  Currently Unavailable
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Editorial Product Information */}
      <div className="p-8 border-t border-neutral-100 dark:border-neutral-800">
        {/* Product Name */}
        <Link href={`/product-details/${product?.id}`} prefetch={true}>
          <h3 className="text-lg font-light text-neutral-900 dark:text-white mb-4 leading-tight tracking-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors duration-300 line-clamp-2">
            {product?.name}
          </h3>
        </Link>

        {/* Rating Section */}
        {product?.rating > 0 && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`text-lg ${
                      index < Math.floor(product?.rating) 
                        ? 'text-neutral-900 dark:text-white' 
                        : 'text-neutral-200 dark:text-neutral-700'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-light text-neutral-500 dark:text-neutral-400">
                {product.rating}
              </span>
            </div>
            {product?.reviewCount && (
              <span className="text-xs font-light text-neutral-400 dark:text-neutral-500 tracking-wide">
                {product?.reviewCount?.toLocaleString()} reviews
              </span>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-6">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-light text-neutral-900 dark:text-white tracking-tight">
              ₹{product?.price?.toLocaleString('en-IN')}
            </span>
            {product?.originalPrice && product?.originalPrice > product?.price && (
              <span className="text-base text-neutral-400 dark:text-neutral-500 line-through font-light">
                ₹{product?.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          
          {/* Quick Add Icon */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !product?.inStock}
            className="w-12 h-12 rounded-full border border-neutral-900 dark:border-white flex items-center justify-center hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all duration-300 disabled:opacity-30"
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
