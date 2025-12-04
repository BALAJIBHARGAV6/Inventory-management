'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/contexts/CartContext';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart || !product?.inStock) return;
    
    setIsAddingToCart(true);
    addToCart(product, 1);
    setTimeout(() => setIsAddingToCart(false), 600);
  };

  const discountPercentage = product?.originalPrice 
    ? Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/product-details?id=${product.id}`}
      className="group block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative w-full h-52 md:h-60 overflow-hidden bg-gray-50 dark:bg-gray-800">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${product?.image})` }}
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute top-3 left-3 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-lg">
            -{discountPercentage}% OFF
          </span>
        )}
        
        {/* Out of Stock Overlay */}
        {!product?.inStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className={`absolute bottom-3 right-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={handleAddToCart}
            disabled={!product?.inStock || isAddingToCart}
            className={`w-11 h-11 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
              !product?.inStock ? 'cursor-not-allowed opacity-50' : 'hover:bg-primary hover:text-white'
            }`}
            aria-label="Add to cart"
          >
            {isAddingToCart ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon name="ShoppingCartIcon" size={20} />
            )}
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} hover:bg-red-50 hover:text-red-500`}
        >
          <Icon name="HeartIcon" size={18} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
          {product?.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="StarIcon"
                size={14}
                variant={index < Math.floor(product?.rating || 0) ? 'solid' : 'outline'}
                className={index < Math.floor(product?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          {product?.reviewCount > 0 && (
            <span className="text-xs text-gray-500">
              ({product?.reviewCount})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{product?.price?.toLocaleString('en-IN')}
          </span>
          {product?.originalPrice && product?.originalPrice > product?.price && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product?.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
