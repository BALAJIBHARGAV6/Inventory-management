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
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      <Link
        href="/homepage"
        className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-micro"
      >
        <Icon name="HomeIcon" size={16} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {items?.map((item, index) => {
        const isLast = index === items?.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            <Icon 
              name="ChevronRightIcon" 
              size={14} 
              className="text-muted-foreground flex-shrink-0" 
            />
            {isLast ? (
              <span 
                className="text-text-primary font-medium truncate max-w-[200px] sm:max-w-none"
                aria-current="page"
              >
                {item?.label}
              </span>
            ) : (
              <Link
                href={item?.path}
                className="text-muted-foreground hover:text-accent transition-micro truncate max-w-[150px] sm:max-w-none"
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
