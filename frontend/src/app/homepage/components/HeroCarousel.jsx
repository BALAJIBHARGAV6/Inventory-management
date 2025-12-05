'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

// Premium hero slides with luxury images - Original + New
const PREMIUM_SLIDES = [
  {
    id: 1,
    title: 'Elevate Your Lifestyle',
    subtitle: 'Premium Collection 2024',
    description: 'Discover curated products that define elegance and sophistication.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&q=90',
    buttonText: 'Explore Collection',
    link: '/product-listing',
  },
  {
    id: 2,
    title: 'Technology Redefined',
    subtitle: 'Latest Innovations',
    description: 'Experience cutting-edge electronics crafted for the modern connoisseur.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&h=1080&fit=crop&q=90',
    buttonText: 'Shop Electronics',
    link: '/product-listing',
  },
  {
    id: 3,
    title: 'Timeless Fashion',
    subtitle: 'Signature Styles',
    description: 'Where classic meets contemporary. Dress to impress.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=90',
    buttonText: 'View Collection',
    link: '/product-listing',
  },
  {
    id: 4,
    title: 'Curated Excellence',
    subtitle: 'Home & Living',
    description: 'Transform your space with thoughtfully designed pieces for modern living.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop&q=95',
    buttonText: 'Shop Home',
    link: '/product-listing',
  },
  {
    id: 5,
    title: 'Innovation Meets Design',
    subtitle: 'Premium Tech',
    description: 'Experience the future through carefully selected cutting-edge products.',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop&q=95',
    buttonText: 'Discover Tech',
    link: '/product-listing',
  },
];

export default function HeroCarousel({ slides = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const displaySlides = PREMIUM_SLIDES;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
  }, [displaySlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Auto-play carousel - always runs
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 4000); // 4 seconds delay
    return () => clearInterval(interval);
  }, [displaySlides.length]);

  return (
    <div 
      className="relative w-full h-[100vh] min-h-[600px] max-h-[900px] overflow-hidden group"
    >
      {displaySlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            index === currentSlide 
              ? 'opacity-100 z-10' 
              : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image - Clean & Simple */}
          <div 
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-6000 ease-out ${
              index === currentSlide ? 'scale-105' : 'scale-100'
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
              <div className="max-w-2xl">
                <div className={`mb-4 transition-all duration-1000 delay-300 ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}>
                  <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/90 bg-white/10 px-4 py-2 backdrop-blur-sm">
                    {slide.subtitle}
                  </span>
                </div>
                
                <h1 className={`text-4xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight tracking-tight transition-all duration-1000 delay-500 ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}>
                  {slide.title}
                </h1>
                
                <p className={`text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-light max-w-lg transition-all duration-1000 delay-700 ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}>
                  {slide.description}
                </p>
                
                <div className={`transition-all duration-1000 delay-1000 ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}>
                  <Link
                    href={slide.link}
                    className="inline-flex items-center gap-4 px-8 py-4 bg-white text-black text-sm font-bold tracking-widest uppercase hover:bg-neutral-200 transition-all duration-300 group"
                  >
                    {slide.buttonText}
                    <Icon name="ArrowRightIcon" size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {displaySlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center border border-white/30 bg-white/10 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black"
            aria-label="Previous slide"
          >
            <Icon name="ChevronLeftIcon" size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center border border-white/30 bg-white/10 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black"
            aria-label="Next slide"
          >
            <Icon name="ChevronRightIcon" size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === currentSlide 
                    ? 'bg-white w-12' 
                    : 'bg-white/40 w-8 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute bottom-12 right-6 md:right-12 z-20 text-white/60 text-sm font-medium tracking-wider">
            <span className="text-white">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="mx-2">/</span>
            <span>{String(displaySlides.length).padStart(2, '0')}</span>
          </div>
        </>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-6 md:left-12 z-20 flex items-center gap-3 text-white/60">
        <div className="w-px h-12 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-pulse" />
        </div>
        <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
      </div>
    </div>
  );
}
