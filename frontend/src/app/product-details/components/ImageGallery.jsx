'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function ImageGallery({ images = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <Icon name="PhotoIcon" size={48} className="text-muted-foreground" />
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="relative aspect-square bg-card rounded-xl sm:rounded-2xl overflow-hidden border border-border">
        <AppImage
          src={selectedImage?.url || selectedImage}
          alt={selectedImage?.alt || 'Product image'}
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-full shadow-md hover:bg-background transition-micro"
            >
              <Icon name="ChevronLeftIcon" size={18} className="sm:hidden" />
              <Icon name="ChevronLeftIcon" size={20} className="hidden sm:block" />
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-full shadow-md hover:bg-background transition-micro"
            >
              <Icon name="ChevronRightIcon" size={18} className="sm:hidden" />
              <Icon name="ChevronRightIcon" size={20} className="hidden sm:block" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 px-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-micro ${
                index === selectedIndex ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              <AppImage
                src={image?.url || image}
                alt={image?.alt || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
