'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import SortControl from './SortControl';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/contexts/CartContext';

export default function ProductListingInteractive({ initialProducts = [] }) {
  const { cartCount } = useCart();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [products] = useState(initialProducts);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    priceRange: [0, 200000],
    categories: [],
    brands: [],
    inStockOnly: false,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const breadcrumbItems = [
    { label: 'Collection', path: '/product-listing' },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => 
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      );
    }

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

  const { addToCart } = useCart();

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white">
      <Header />
      <main className="pt-16">
        {/* Minimalist Hero Section */}
        <section className="relative py-12 md:py-16 bg-white dark:bg-neutral-950">
          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-thin text-neutral-900 dark:text-white mb-3 tracking-tight leading-none">
                Our Collection
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-400 font-light">
                Discover meticulously curated products that embody elegance, quality, and timeless sophistication
              </p>
            </div>
          </div>
        </section>

        <div className="py-16 md:py-20 bg-white dark:bg-neutral-950">
          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12">
            {/* Elegant Filter & Sort Bar */}
            <div className="flex items-center justify-between mb-16 pb-8 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-3 px-6 py-3 border border-neutral-900 dark:border-white text-neutral-900 dark:text-white text-sm font-medium hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors duration-300"
                >
                  <Icon name="AdjustmentsHorizontalIcon" size={16} />
                  Filters
                </button>
                <div className="hidden lg:flex items-center gap-3 text-sm font-light text-neutral-600 dark:text-neutral-400">
                  <Icon name="Squares2X2Icon" size={16} />
                  <span>{filteredAndSortedProducts.length} Products Found</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="hidden md:flex items-center gap-1 p-1 border border-neutral-200 dark:border-neutral-700 rounded">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' 
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon name="Squares2X2Icon" size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' 
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon name="ListBulletIcon" size={16} />
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
                <div className="flex flex-col items-center justify-center py-24 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-8">
                    <Icon name="MagnifyingGlassIcon" size={32} className="text-neutral-400 dark:text-neutral-500" />
                  </div>
                  <h2 className="text-2xl font-light text-neutral-900 dark:text-white mb-4">No Products Found</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 text-center max-w-md mb-8 font-light">
                    We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() => setFilters({ priceRange: [0, 200000], categories: [], brands: [], inStockOnly: false })}
                    className="px-6 py-3 border border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-medium hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors duration-300"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className={`grid ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                    : 'grid-cols-1 gap-6'
                }`}>
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
              
              {/* Load More Button */}
              {filteredAndSortedProducts.length > 0 && (
                <div className="flex justify-center mt-20">
                  <button className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-500 border-b border-neutral-900 dark:border-white">
                    Load More Products
                    <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed inset-y-0 left-0 z-[95] w-80 max-w-full bg-white dark:bg-neutral-950 shadow-2xl lg:hidden overflow-y-auto border-r border-neutral-200 dark:border-neutral-800">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-lg font-light text-neutral-900 dark:text-white tracking-wide">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-300"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>
            <div className="p-6">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
