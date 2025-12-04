'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function HeroCarousel({ slides = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, nextSlide]);

  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No slides available</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden group shadow-xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide?.id || index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <AppImage
            src={slide?.image}
            alt={slide?.alt || slide?.title}
            className="w-full h-full object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="max-w-lg text-background">
                {slide?.badge && (
                  <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold bg-accent text-accent-foreground rounded-full">
                    {slide?.badge}
                  </span>
                )}
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 font-heading">
                  {slide?.title}
                </h2>
                <p className="text-sm md:text-base mb-6 opacity-90">
                  {slide?.description}
                </p>
                <Link
                  href={slide?.link || '/product-listing'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-micro"
                >
                  {slide?.buttonText || 'Shop Now'}
                  <Icon name="ArrowRightIcon" size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center glass-card rounded-full text-text-primary opacity-0 group-hover:opacity-100 transition-smooth hover:scale-110"
            aria-label="Previous slide"
          >
            <Icon name="ChevronLeftIcon" size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center glass-card rounded-full text-text-primary opacity-0 group-hover:opacity-100 transition-smooth hover:scale-110"
            aria-label="Next slide"
          >
            <Icon name="ChevronRightIcon" size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-micro ${
                  index === currentSlide ? 'bg-background w-6' : 'bg-background/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
