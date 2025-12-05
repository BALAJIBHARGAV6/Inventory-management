'use client';

import Icon from '@/components/ui/AppIcon';

export default function ProductInfo({ product }) {
  if (!product) return null;

  const discountPercentage = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Badge & Category */}
      <div className="flex items-center gap-3">
        {product?.badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-sm">
            <Icon name="FireIcon" size={12} />
            {product.badge}
          </span>
        )}
        <span className="px-3 py-1 text-xs font-medium text-text-secondary bg-muted rounded-full">
          {product?.category}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
        {product?.name}
      </h1>

      {/* Rating */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <Icon name="StarIcon" size={16} className="text-amber-500" variant="solid" />
          <span className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400">
            {product?.rating?.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              name="StarIcon"
              size={14}
              variant={index < Math.floor(product?.rating || 0) ? 'solid' : 'outline'}
              className={index < Math.floor(product?.rating || 0) ? 'text-amber-400' : 'text-muted-foreground/30'}
            />
          ))}
        </div>
        <span className="text-xs sm:text-sm text-text-secondary">
          ({product?.reviewCount?.toLocaleString()} reviews)
        </span>
      </div>

      {/* Price Section */}
      <div className="bg-gradient-to-r from-muted/50 to-transparent p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-border">
        <div className="flex items-baseline gap-2 sm:gap-4 flex-wrap">
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary">
            ₹{product?.price?.toLocaleString('en-IN')}
          </span>
          {product?.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-base sm:text-xl text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-sm">
                {discountPercentage}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-text-secondary mt-1 sm:mt-2">Inclusive of all taxes</p>
      </div>

      {/* Stock Status */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {product?.inStock ? (
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg sm:rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400">In Stock</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl">
            <Icon name="XCircleIcon" size={16} className="text-red-500" />
            <span className="text-xs sm:text-sm font-semibold text-red-700 dark:text-red-400">Out of Stock</span>
          </div>
        )}
        <span className="text-[10px] sm:text-xs text-text-secondary">Usually ships within 24 hours</span>
      </div>

      {/* Description */}
      <div className="pt-4 sm:pt-6 border-t border-border">
        <h2 className="text-base sm:text-lg font-bold text-text-primary mb-2 sm:mb-4 flex items-center gap-2">
          <Icon name="DocumentTextIcon" size={18} className="text-accent" />
          About this product
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          {product?.description}
        </p>
      </div>

      {/* Features */}
      {product?.features && product.features.length > 0 && (
        <div className="pt-4 sm:pt-6 border-t border-border">
          <h2 className="text-base sm:text-lg font-bold text-text-primary mb-2 sm:mb-4 flex items-center gap-2">
            <Icon name="SparklesIcon" size={18} className="text-accent" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {product.features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg sm:rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="CheckIcon" size={12} className="text-green-600" />
                </div>
                <span className="text-xs sm:text-sm text-text-primary">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
