'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getFilterData } from '@/lib/supabase';

export default function FilterPanel({ filters, onFilterChange, onClose }) {
  const [priceRange, setPriceRange] = useState(filters?.priceRange || [0, 200000]);
  const [selectedCategories, setSelectedCategories] = useState(filters?.categories || []);
  const [selectedBrands, setSelectedBrands] = useState(filters?.brands || []);
  const [inStockOnly, setInStockOnly] = useState(filters?.inStockOnly || false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    brands: true,
  });

  // Fetch filter data from database
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        const filterData = await getFilterData();
        setCategories(filterData.categories || []);
        setBrands(filterData.brands || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
        // Fallback to static data
        setCategories([
          { name: 'Electronics', count: 8 },
          { name: 'Fashion', count: 2 },
          { name: 'Home & Living', count: 1 },
          { name: 'Sports', count: 2 },
        ]);
        setBrands([
          { name: 'Apple', count: 4 },
          { name: 'Samsung', count: 3 },
          { name: 'Sony', count: 2 },
          { name: 'Nike', count: 2 },
          { name: 'Adidas', count: 1 },
          { name: 'LG', count: 1 },
          { name: 'Dyson', count: 1 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
  };

  const handleBrandToggle = (brand) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updated);
  };

  const handleApplyFilters = () => {
    onFilterChange({
      priceRange,
      categories: selectedCategories,
      brands: selectedBrands,
      inStockOnly,
    });
    if (onClose) onClose();
  };

  const handleClearFilters = () => {
    setPriceRange([0, 200000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    onFilterChange({
      priceRange: [0, 200000],
      categories: [],
      brands: [],
      inStockOnly: false,
    });
  };

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + (inStockOnly ? 1 : 0);

  return (
    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-light text-neutral-900 dark:text-white tracking-wide">Filters</h2>
            {activeFiltersCount > 0 && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mt-1">
                {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            onClick={handleClearFilters}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light tracking-wide"
          >
            Reset All
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Price Range */}
        <div>
          <button 
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-sm font-semibold text-text-primary">Price Range</h3>
            <Icon 
              name={expandedSections.price ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
              size={18} 
              className="text-text-secondary" 
            />
          </button>
          {expandedSections.price && (
            <div className="space-y-4 animate-slide-down">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-text-secondary mb-1 block">Min</label>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full h-11 px-4 text-sm bg-muted border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="₹0"
                  />
                </div>
                <div className="text-text-secondary mt-5">—</div>
                <div className="flex-1">
                  <label className="text-xs text-text-secondary mb-1 block">Max</label>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 200000])}
                    className="w-full h-11 px-4 text-sm bg-muted border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="₹200000"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {[10000, 25000, 50000, 100000].map((price) => (
                  <button
                    key={price}
                    onClick={() => setPriceRange([0, price])}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${
                      priceRange[1] === price 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    ₹{(price/1000)}K
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="border-t border-border pt-6">
          <button 
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-sm font-semibold text-text-primary">Categories</h3>
            <Icon 
              name={expandedSections.categories ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
              size={18} 
              className="text-text-secondary" 
            />
          </button>
          {expandedSections.categories && (
            <div className="space-y-2 animate-slide-down">
              {categories.map((category) => (
                <label 
                  key={category.name} 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-smooth ${
                    selectedCategories.includes(category.name) 
                      ? 'bg-accent/10 border border-accent/30' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-smooth ${
                      selectedCategories.includes(category.name) 
                        ? 'bg-accent border-accent' 
                        : 'border-border'
                    }`}>
                      {selectedCategories.includes(category.name) && (
                        <Icon name="CheckIcon" size={12} className="text-accent-foreground" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryToggle(category.name)}
                      className="sr-only"
                    />
                    <span className="text-sm text-text-primary">{category.name}</span>
                  </div>
                  <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="border-t border-border pt-6">
          <button 
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-sm font-semibold text-text-primary">Brands</h3>
            <Icon 
              name={expandedSections.brands ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
              size={18} 
              className="text-text-secondary" 
            />
          </button>
          {expandedSections.brands && (
            <div className="space-y-2 animate-slide-down">
              {brands.map((brand) => (
                <label 
                  key={brand.name} 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-smooth ${
                    selectedBrands.includes(brand.name) 
                      ? 'bg-accent/10 border border-accent/30' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-smooth ${
                      selectedBrands.includes(brand.name) 
                        ? 'bg-accent border-accent' 
                        : 'border-border'
                    }`}>
                      {selectedBrands.includes(brand.name) && (
                        <Icon name="CheckIcon" size={12} className="text-accent-foreground" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandToggle(brand.name)}
                      className="sr-only"
                    />
                    <span className="text-sm text-text-primary">{brand.name}</span>
                  </div>
                  <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded-full">
                    {brand.count}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* In Stock Only */}
        <div className="border-t border-border pt-6">
          <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-smooth ${
            inStockOnly ? 'bg-accent/10 border border-accent/30' : 'bg-muted'
          }`}>
            <div className="flex items-center gap-3">
              <Icon name="CheckBadgeIcon" size={20} className={inStockOnly ? 'text-accent' : 'text-text-secondary'} />
              <span className="text-sm font-medium text-text-primary">In Stock Only</span>
            </div>
            <div 
              className={`w-12 h-7 rounded-full p-1 transition-smooth ${
                inStockOnly ? 'bg-accent' : 'bg-border'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                inStockOnly ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Apply Button */}
      <div className="p-5 border-t border-border">
        <button
          onClick={handleApplyFilters}
          className="w-full py-4 text-sm font-bold text-primary-foreground bg-primary rounded-xl hover:scale-[1.02] transition-smooth flex items-center justify-center gap-2"
        >
          <Icon name="FunnelIcon" size={18} />
          Apply Filters
        </button>
      </div>
    </div>
  );
}
