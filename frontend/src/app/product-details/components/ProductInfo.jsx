'use client';

import Icon from '@/components/ui/AppIcon';

export default function ProductInfo({ product }) {
  if (!product) return null;

  const discountPercentage = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {product?.badge && (
        <span className="inline-block px-3 py-1 text-xs font-semibold text-accent-foreground bg-accent rounded-full">
          {product.badge}
        </span>
      )}

      <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
        {product?.name}
      </h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              name="StarIcon"
              size={18}
              variant={index < Math.floor(product?.rating || 0) ? 'solid' : 'outline'}
              className={index < Math.floor(product?.rating || 0) ? 'text-warning' : 'text-muted-foreground'}
            />
          ))}
        </div>
        <span className="text-sm text-text-secondary">
          {product?.rating?.toFixed(1)} ({product?.reviewCount} reviews)
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-text-primary">
          ₹{product?.price?.toLocaleString('en-IN')}
        </span>
        {product?.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="px-2 py-1 text-sm font-semibold text-success-foreground bg-success rounded">
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {product?.inStock ? (
          <>
            <Icon name="CheckCircleIcon" size={20} className="text-success" />
            <span className="text-sm font-medium text-success">In Stock</span>
          </>
        ) : (
          <>
            <Icon name="XCircleIcon" size={20} className="text-error" />
            <span className="text-sm font-medium text-error">Out of Stock</span>
          </>
        )}
      </div>

      <div className="pt-6 border-t border-border">
        <h2 className="text-lg font-semibold text-text-primary mb-3">Product Description</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {product?.description}
        </p>
      </div>

      {product?.features && product.features.length > 0 && (
        <div className="pt-6 border-t border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-3">Key Features</h2>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                <Icon name="CheckIcon" size={16} className="text-success flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
