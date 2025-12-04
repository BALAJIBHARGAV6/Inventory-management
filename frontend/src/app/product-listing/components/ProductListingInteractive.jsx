'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import SortControl from './SortControl';
import Icon from '@/components/ui/AppIcon';

export default function ProductListingInteractive({ initialProducts = [] }) {
  const [products] = useState(initialProducts);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    priceRange: [0, 200000],
    categories: [],
    brands: [],
    inStockOnly: false,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [viewMode, setViewMode] = useState('grid');

  const breadcrumbItems = [
    { label: 'Shop', path: '/product-listing' },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply filters
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
      default:
        break;
    }

    return result;
  }, [products, filters, sortBy]);

  const handleAddToCart = async (product) => {
    console.log('Adding to cart:', product.name);
    setCartCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} />
      <main className="pt-16">
        {/* Hero Banner */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 animate-slide-up">
                Shop All
                <span className="block text-accent">Products</span>
              </h1>
              <p className="text-lg text-text-secondary animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Discover our curated collection of premium products. Quality meets style.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 mb-8 glass-card rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-sm font-medium glass-card rounded-xl hover:bg-muted transition-smooth"
              >
                <Icon name="AdjustmentsHorizontalIcon" size={18} />
                Filters
              </button>
              <div className="hidden lg:flex items-center gap-2 text-sm text-text-secondary">
                <Icon name="Squares2X2Icon" size={18} />
                <span>{filteredAndSortedProducts.length} products</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 p-1 glass-card rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-smooth ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  <Icon name="Squares2X2Icon" size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-smooth ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  <Icon name="ListBulletIcon" size={18} />
                </button>
              </div>
              
              <SortControl
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalProducts={filteredAndSortedProducts.length}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filter Panel */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <FilterPanel
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            </div>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              {filteredAndSortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 glass-card rounded-3xl">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                    <Icon name="MagnifyingGlassIcon" size={40} className="text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-3">No products found</h2>
                  <p className="text-text-secondary text-center max-w-md mb-6">
                    We couldn't find any products matching your criteria. Try adjusting your filters.
                  </p>
                  <button
                    onClick={() => setFilters({ priceRange: [0, 200000], categories: [], brands: [], inStockOnly: false })}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:scale-105 transition-smooth"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredAndSortedProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Load More Button */}
              {filteredAndSortedProducts.length > 0 && (
                <div className="flex justify-center mt-12">
                  <button className="px-8 py-4 glass-card rounded-xl font-medium hover:scale-105 transition-smooth flex items-center gap-2">
                    Load More Products
                    <Icon name="ArrowDownIcon" size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed inset-y-0 left-0 z-[95] w-80 max-w-full bg-background shadow-modal lg:hidden overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 text-muted-foreground hover:text-text-primary transition-micro"
              >
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
