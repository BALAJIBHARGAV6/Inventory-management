'use client';

import Icon from '@/components/ui/AppIcon';

export default function SortControl({ sortBy, onSortChange, totalProducts }) {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Icon name="ArrowsUpDownIcon" size={18} className="text-text-secondary" />
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-11 px-4 pr-10 text-sm bg-muted border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer font-medium appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
