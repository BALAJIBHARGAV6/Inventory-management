'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HeroCarousel from './HeroCarousel';
import CategoryCard from './CategoryCard';
import ProductSection from './ProductSection';
import TrustIndicators from './TrustIndicators';
import TestimonialCard from './TestimonialCard';

// Premium category data with high-quality images
const PREMIUM_CATEGORIES = [
  {
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop&q=90',
    description: 'Premium Tech',
    link: '/product-listing?category=electronics',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop&q=90',
    description: 'Luxury Styles',
    link: '/product-listing?category=fashion',
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=90',
    description: 'Modern Living',
    link: '/product-listing?category=home-living',
  },
  {
    name: 'Sports',
    slug: 'sports',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop&q=90',
    description: 'Active Life',
    link: '/product-listing?category=sports',
  },
];

export default function HomepageInteractive({ pageData }) {
  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white selection:bg-black selection:text-white">
      <Header onSearchSubmit={handleSearch} />
      
      <main>
        {/* Hero Section - Full Screen */}
        <section className="pt-16">
          <HeroCarousel slides={pageData?.heroSlides} />
        </section>

        {/* Categories Section - Minimal Grid */}
        <section className="py-12 md:py-16 border-b border-neutral-100 dark:border-neutral-800">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight">
                Shop by Category
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-4 md:mt-0 text-sm tracking-widest uppercase">
                Curated Collections
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
              {PREMIUM_CATEGORIES.map((category) => (
                <CategoryCard key={category.name} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        <ProductSection 
          title="Bestsellers" 
          subtitle="Most loved by our customers"
          products={pageData?.bestsellers} 
          viewAllLink="/product-listing?sort=bestseller" 
        />
        
        {/* Featured Banner - Compact Split Layout */}
        <section className="py-8 md:py-12 bg-white dark:bg-neutral-900">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Content Side */}
              <div className="flex flex-col justify-center order-2 md:order-1">
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-500 dark:text-neutral-400 mb-4">
                  New Season
                </span>
                <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight text-neutral-900 dark:text-white leading-tight">
                  Elevate Your Everyday
                </h2>
                <p className="text-base text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                  Discover exceptional pieces that seamlessly blend timeless design with contemporary functionality for the modern lifestyle.
                </p>
                <div>
                  <Link
                    href="/product-listing"
                    className="inline-flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-white border-b border-neutral-900 dark:border-white pb-1 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors group"
                  >
                    Discover Collection
                    <Icon name="ArrowRightIcon" size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Image Side - Smaller */}
              <div className="relative aspect-[4/3] overflow-hidden order-1 md:order-2">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop&q=95)' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <ProductSection 
          title="New Arrivals" 
          subtitle="Fresh additions to our collection"
          products={pageData?.newArrivals} 
          viewAllLink="/product-listing?sort=newest" 
        />

        {/* Trust Indicators */}
        <TrustIndicators />

        {/* Testimonials Section - Ultra Premium */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-white via-neutral-50/50 to-white dark:from-neutral-950 dark:via-neutral-900/50 dark:to-neutral-950 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent"></div>
            <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent"></div>
          </div>

          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 relative">
            {/* Elegant Section Header */}
            <header className="text-center mb-20 md:mb-28">
              <div className="inline-flex items-center gap-6 mb-8">
                <div className="h-px bg-neutral-300 dark:bg-neutral-700 w-20"></div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-neutral-900 dark:bg-white transform rotate-45"></div>
                  <div className="w-1 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
                </div>
                <div className="h-px bg-neutral-300 dark:bg-neutral-700 w-20"></div>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-thin text-neutral-900 dark:text-white tracking-tight leading-none mb-6">
                Client Stories
              </h2>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-light max-w-3xl mx-auto leading-relaxed">
                Trusted by thousands of discerning customers who value quality, service, and excellence
              </p>
            </header>

            {/* Premium Testimonials Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
              {pageData?.testimonials?.map((testimonial, index) => (
                <div key={index} className="relative">
                  {/* Card Background */}
                  <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl shadow-lg"></div>
                  
                  {/* Content */}
                  <div className="relative p-8 md:p-10">
                    <TestimonialCard testimonial={testimonial} />
                  </div>

                  {/* Card Number */}
                  <div className="absolute -top-4 -right-4">
                    <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white dark:text-neutral-900">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Decoration */}
            <div className="flex justify-center mt-20 md:mt-24">
              <div className="flex items-center gap-3">
                <div className="w-3 h-px bg-neutral-300 dark:bg-neutral-700"></div>
                <div className="w-1 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
                <div className="w-6 h-px bg-neutral-300 dark:bg-neutral-700"></div>
                <div className="w-1 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
                <div className="w-3 h-px bg-neutral-300 dark:bg-neutral-700"></div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
