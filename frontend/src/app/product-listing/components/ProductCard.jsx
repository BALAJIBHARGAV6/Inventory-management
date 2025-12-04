'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function ProductCard({ product, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false);
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
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const discountPercentage = product?.originalPrice 
    ? Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100)
    : 0;

  return (
    <Link
      href="/product-details"
      className="group block glass-card rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-smooth"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-48 md:h-56 overflow-hidden bg-muted">
        <AppImage
          src={product?.image}
          alt={product?.alt || product?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        
        {discountPercentage > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded">
            -{discountPercentage}%
          </span>
        )}
        
        {!product?.inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="px-3 py-1 text-sm font-semibold bg-error text-error-foreground rounded">
              Out of Stock
            </span>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!product?.inStock || isAddingToCart}
          className={`absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-full transition-micro ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } ${!product?.inStock ? 'cursor-not-allowed opacity-50' : 'hover:bg-primary/90'}`}
          aria-label="Add to cart"
        >
          {isAddingToCart ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon name="ShoppingCartIcon" size={18} />
          )}
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-text-primary truncate mb-1">
          {product?.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="StarIcon"
                size={14}
                variant={index < Math.floor(product?.rating || 0) ? 'solid' : 'outline'}
                className={index < Math.floor(product?.rating || 0) ? 'text-warning' : 'text-muted-foreground'}
              />
            ))}
          </div>
          {product?.reviewCount && (
            <span className="text-xs text-muted-foreground">
              ({product?.reviewCount})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-text-primary">
            ₹{product?.price?.toLocaleString('en-IN')}
          </span>
          {product?.originalPrice && product?.originalPrice > product?.price && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product?.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
