'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function HeroCarousel({ slides = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [slides.length, isTransitioning]);

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, nextSlide]);

  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading amazing deals...</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[400px] md:h-[520px] lg:h-[620px] rounded-3xl overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide?.id || index}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            index === currentSlide 
              ? 'opacity-100 scale-100 z-10' 
              : 'opacity-0 scale-105 z-0'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide?.image})`,
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)',
              transition: 'transform 8s ease-out'
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-10 lg:px-16">
              <div className="max-w-2xl">
                {slide?.badge && (
                  <span 
                    className={`inline-block px-4 py-1.5 mb-6 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-accent to-primary text-white rounded-full shadow-lg transform transition-all duration-700 delay-100 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    {slide?.badge}
                  </span>
                )}
                <h2 
                  className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight transform transition-all duration-700 delay-200 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                >
                  {slide?.title}
                </h2>
                <p 
                  className={`text-base md:text-lg lg:text-xl text-white/90 mb-8 max-w-xl transform transition-all duration-700 delay-300 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {slide?.description}
                </p>
                <Link
                  href={slide?.link || '/product-listing'}
                  className={`inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/25 hover:scale-105 active:scale-95 transition-all duration-300 transform delay-400 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {slide?.buttonText || 'Shop Now'}
                  <Icon name="ArrowRightIcon" size={22} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl"
            aria-label="Previous slide"
          >
            <Icon name="ChevronLeftIcon" size={28} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl"
            aria-label="Next slide"
          >
            <Icon name="ChevronRightIcon" size={28} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  index === currentSlide 
                    ? 'bg-white w-8 shadow-lg' 
                    : 'bg-white/40 w-2.5 hover:bg-white/60'
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
