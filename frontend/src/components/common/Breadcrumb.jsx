'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function Breadcrumb({ items = [], className = '' }) {
  if (!items || items?.length === 0) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto scrollbar-hide ${className}`}
    >
      <Link
        href="/homepage"
        className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground hover:text-accent transition-micro flex-shrink-0"
      >
        <Icon name="HomeIcon" size={14} className="sm:hidden" />
        <Icon name="HomeIcon" size={16} className="hidden sm:block" />
      </Link>
      {items?.map((item, index) => {
        const isLast = index === items?.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Icon 
              name="ChevronRightIcon" 
              size={12} 
              className="text-muted-foreground flex-shrink-0 sm:hidden" 
            />
            <Icon 
              name="ChevronRightIcon" 
              size={14} 
              className="text-muted-foreground flex-shrink-0 hidden sm:block" 
            />
            {isLast ? (
              <span 
                className="text-text-primary font-medium truncate max-w-[120px] sm:max-w-[200px] md:max-w-none"
                aria-current="page"
              >
                {item?.label}
              </span>
            ) : (
              <Link
                href={item?.path}
                className="text-muted-foreground hover:text-accent transition-micro truncate max-w-[80px] sm:max-w-[150px] md:max-w-none"
              >
                {item?.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
