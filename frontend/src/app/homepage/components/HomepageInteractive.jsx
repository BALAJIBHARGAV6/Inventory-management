'use client';

import Link from 'next/link';
import Header from '@/components/common/Header';
import HeroCarousel from './HeroCarousel';
import CategoryCard from './CategoryCard';
import ProductSection from './ProductSection';
import TrustIndicators from './TrustIndicators';
import TestimonialCard from './TestimonialCard';
import NewsletterSection from './NewsletterSection';
import Icon from '@/components/ui/AppIcon';

export default function HomepageInteractive({ pageData }) {
  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchSubmit={handleSearch} />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-4 md:py-8">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <HeroCarousel slides={pageData?.heroSlides} />
          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-4">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer">
                <div className="p-3 bg-white/20 rounded-full">
                  <Icon name="TruckIcon" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Free Delivery</h3>
                  <p className="text-sm text-white/80">On orders above ₹999</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer">
                <div className="p-3 bg-white/20 rounded-full">
                  <Icon name="ShieldCheckIcon" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Secure Payment</h3>
                  <p className="text-sm text-white/80">100% secure checkout</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer">
                <div className="p-3 bg-white/20 rounded-full">
                  <Icon name="SparklesIcon" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Powered</h3>
                  <p className="text-sm text-white/80">Smart inventory predictions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                  Shop by Category
                </h2>
                <p className="text-muted-foreground mt-1">Browse our wide range of products</p>
              </div>
              <Link 
                href="/product-listing" 
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-all"
              >
                View All Categories
                <Icon name="ArrowRightIcon" size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {pageData?.categories?.map((category) => (
                <CategoryCard key={category?.name} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Flash Sale Banner */}
        <section className="py-6">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-3">Limited Time Offer</span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">Mega Sale is Live!</h2>
                  <p className="text-lg text-white/90">Get up to 50% off on selected items</p>
                </div>
                <Link href="/product-listing" className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        <ProductSection title="🔥 Bestsellers" products={pageData?.bestsellers} viewAllLink="/product-listing?sort=bestseller" />
        
        {/* New Arrivals Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background">
          <ProductSection title="✨ New Arrivals" products={pageData?.newArrivals} viewAllLink="/product-listing?sort=newest" />
        </section>

        {/* Trust Indicators */}
        <TrustIndicators indicators={pageData?.trustIndicators} />

        {/* Testimonials Section */}
        <section className="py-16 md:py-20 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust us for their shopping needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageData?.testimonials?.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <NewsletterSection />

        {/* Footer */}
        <footer className="py-12 bg-foreground text-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-background rounded-md">
                    <Icon name="CubeIcon" size={20} className="text-foreground" />
                  </div>
                  <span className="text-xl font-bold">InventoryPredictor</span>
                </div>
                <p className="text-sm text-background/70 mb-4">
                  Your one-stop destination for quality products at the best prices.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h3>
                <ul className="space-y-2 text-sm text-background/70">
                  <li><Link href="/product-listing" className="hover:text-background transition-micro">Shop All</Link></li>
                  <li><Link href="/product-listing?category=electronics" className="hover:text-background transition-micro">Electronics</Link></li>
                  <li><Link href="/product-listing?category=fashion" className="hover:text-background transition-micro">Fashion</Link></li>
                  <li><Link href="/product-listing?category=home" className="hover:text-background transition-micro">Home & Living</Link></li>
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Customer Service</h3>
                <ul className="space-y-2 text-sm text-background/70">
                  <li><Link href="#" className="hover:text-background transition-micro">Contact Us</Link></li>
                  <li><Link href="#" className="hover:text-background transition-micro">FAQs</Link></li>
                  <li><Link href="#" className="hover:text-background transition-micro">Shipping Info</Link></li>
                  <li><Link href="#" className="hover:text-background transition-micro">Returns & Exchanges</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Contact Us</h3>
                <ul className="space-y-3 text-sm text-background/70">
                  <li className="flex items-center gap-2">
                    <Icon name="EnvelopeIcon" size={16} />
                    support@inventorypredictor.com
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="PhoneIcon" size={16} />
                    +91 1800-123-4567
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-background/20 text-center">
              <p className="text-sm text-background/60">
                © {new Date().getFullYear()} InventoryPredictor. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
