'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductById, getProducts } from '@/lib/supabase';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      console.log('Fetching product with ID:', productId);
      
      try {
        // Try to get product by ID
        const { data, error } = await getProductById(productId);
        console.log('Product fetch result:', { data, error });
        
        if (data) {
          // Transform data to match expected format
          const transformedProduct = {
            id: data.id,
            name: data.name,
            price: data.price,
            originalPrice: data.original_price || data.originalPrice,
            rating: data.rating || 4.5,
            reviewCount: data.review_count || data.reviewCount || 100,
            inStock: (data.stock_quantity !== undefined ? data.stock_quantity > 0 : true),
            stockQuantity: data.stock_quantity || 10,
            badge: data.is_featured ? 'Bestseller' : null,
            category: data.categories?.name || data.category || 'Products',
            brand: data.brand,
            description: data.description || 'High-quality product with premium features and exceptional build quality. This product is designed to meet your everyday needs with style and functionality.',
            features: [
              'Premium quality materials',
              'Fast shipping available',
              '1 Year warranty included',
              'Easy returns within 7 days',
              '24/7 customer support',
              'Genuine product guarantee',
            ],
            images: [
              data.thumbnail || data.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
              'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
            ],
          };
          console.log('Transformed product:', transformedProduct);
          setProduct(transformedProduct);
        } else {
          console.log('No product data found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Icon name="ArrowPathIcon" size={40} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <Icon name="ExclamationCircleIcon" size={64} className="text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">Product Not Found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const breadcrumbItems = [
    { label: 'Products', path: '/product-listing' },
    { label: product.category, path: `/product-listing?category=${product.category}` },
    { label: product.name, path: '#' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-square w-full overflow-hidden bg-muted rounded-2xl mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & Brand */}
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-medium text-text-secondary bg-muted rounded-full">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="px-3 py-1 text-xs font-medium text-accent bg-accent/10 rounded-full">
                    {product.brand}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Icon name="StarIcon" size={18} className="text-amber-500" />
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                    {product.rating?.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-text-secondary">
                  ({product.reviewCount?.toLocaleString()} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-muted/50 to-transparent p-5 rounded-2xl border border-border">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-4xl font-black text-text-primary">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="px-3 py-1.5 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-2">Inclusive of all taxes</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                {product.inStock ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                      In Stock ({product.stockQuantity} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <Icon name="XCircleIcon" size={18} className="text-red-500" />
                    <span className="text-sm font-semibold text-red-700 dark:text-red-400">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Icon name="MinusIcon" size={18} />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Icon name="PlusIcon" size={18} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addingToCart}
                  className="flex-1 h-12 px-8 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                  ) : (
                    <Icon name="ShoppingCartIcon" size={20} />
                  )}
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>

              {/* Description */}
              <div className="pt-6 border-t border-border">
                <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Icon name="DocumentTextIcon" size={20} className="text-accent" />
                  About this product
                </h2>
                <p className="text-base text-text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="pt-6 border-t border-border">
                <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Icon name="SparklesIcon" size={20} className="text-accent" />
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl"
                    >
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon name="CheckIcon" size={14} className="text-green-600" />
                      </div>
                      <span className="text-sm text-text-primary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                {[
                  { icon: 'TruckIcon', label: 'Free Shipping', desc: 'On orders above ₹999' },
                  { icon: 'ArrowPathIcon', label: 'Easy Returns', desc: '7 days return policy' },
                  { icon: 'ShieldCheckIcon', label: 'Secure Payment', desc: '100% secure checkout' },
                ].map((badge, index) => (
                  <div key={index} className="bg-muted/50 border border-border rounded-2xl p-4 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Icon name={badge.icon} size={20} className="text-accent" />
                    </div>
                    <h4 className="text-xs font-semibold text-text-primary mb-0.5">{badge.label}</h4>
                    <span className="text-[10px] text-text-secondary">{badge.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
