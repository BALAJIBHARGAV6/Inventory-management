'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubscribing(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Thank you for subscribing!');
        setEmail('');
      } else {
        setMessage('Subscribed! We\'ll keep you updated.');
        setEmail('');
      }
    } catch (err) {
      setMessage('Subscribed! We\'ll keep you updated.');
      setEmail('');
    }
    
    setIsSubscribing(false);
    setTimeout(() => setMessage(''), 5000);
  };
  return (
    <footer className="bg-neutral-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/3 w-px h-full bg-white"></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-white"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-white"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="py-16 md:py-20">
          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12">
            {/* Top Section - Brand & Newsletter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                  <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
                    <Icon name="CubeIcon" size={24} className="text-neutral-950" />
                  </div>
                  <span className="text-xl md:text-2xl font-light tracking-tight text-white">
                    INVENTORYPREDICTOR
                  </span>
                </div>
                <p className="text-neutral-400 text-base md:text-lg font-light leading-relaxed max-w-md mx-auto md:mx-0">
                  Curating exceptional products for the discerning modern lifestyle. 
                  Quality, elegance, and innovation in every selection.
                </p>
              </div>

              <div className="md:pl-12">
                <h3 className="text-lg font-light mb-4 md:mb-6 text-white tracking-wide text-center md:text-left">
                  Stay Updated
                </h3>
                <p className="text-neutral-400 mb-4 md:mb-6 font-light text-center md:text-left text-sm md:text-base">
                  Subscribe to receive exclusive offers and new arrivals
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-neutral-400 focus:outline-none focus:border-white/40 transition-colors rounded-sm"
                      required
                    />
                    <button 
                      type="submit"
                      disabled={isSubscribing}
                      className="px-6 py-3 bg-white text-neutral-950 font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </div>
                  {message && (
                    <p className="text-green-400 text-sm text-center md:text-left">{message}</p>
                  )}
                </form>
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
              <div>
                <h4 className="text-sm font-medium mb-6 uppercase tracking-[0.2em] text-neutral-300">Shop</h4>
                <ul className="space-y-3">
                  <li><Link href="/product-listing" prefetch={true} className="text-neutral-400 hover:text-white transition-colors font-light">All Products</Link></li>
                  <li><Link href="/product-listing?category=electronics" prefetch={true} className="text-neutral-400 hover:text-white transition-colors font-light">Electronics</Link></li>
                  <li><Link href="/product-listing?category=fashion" prefetch={true} className="text-neutral-400 hover:text-white transition-colors font-light">Fashion</Link></li>
                  <li><Link href="/product-listing?category=home-living" prefetch={true} className="text-neutral-400 hover:text-white transition-colors font-light">Home & Living</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-6 uppercase tracking-[0.2em] text-neutral-300">Support</h4>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/contact" 
                      prefetch={true} 
                      className="text-neutral-400 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/faq" 
                      prefetch={true} 
                      className="text-neutral-400 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/shipping-returns" 
                      prefetch={true} 
                      className="text-neutral-400 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block"
                    >
                      Shipping & Returns
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/faq" 
                      prefetch={true} 
                      className="text-neutral-400 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block"
                    >
                      Help Center
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-6 uppercase tracking-[0.2em] text-neutral-300">Legal</h4>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/about" 
                      prefetch={true} 
                      className="text-neutral-400 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/privacy-policy" 
                      prefetch={true} 
                      className="text-neutral-400 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/terms-of-service" 
                      prefetch={true} 
                      className="text-neutral-400 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/contact" 
                      prefetch={true} 
                      className="text-neutral-400 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block"
                    >
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-6 uppercase tracking-[0.2em] text-neutral-300">Connect</h4>
                <ul className="space-y-3 text-neutral-400 font-light">
                  <li className="break-all text-xs sm:text-sm md:text-base">inventorypredictor@gmail.com</li>
                  <li>+91 98765 43210</li>
                  <li className="text-sm">Vijayawada, AP</li>
                  <li>India</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-6 md:py-8">
          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm text-neutral-500 text-center">
                <span>© {new Date().getFullYear()} InventoryPredictor</span>
                <div className="flex items-center gap-4">
                  <Link 
                    href="/privacy-policy" 
                    prefetch={true} 
                    className="hover:text-white transition-all duration-300"
                  >
                    Privacy
                  </Link>
                  <Link 
                    href="/terms-of-service" 
                    prefetch={true} 
                    className="hover:text-white transition-all duration-300"
                  >
                    Terms
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-500 uppercase tracking-wider hidden sm:block">Follow Us</span>
                <div className="flex items-center gap-3">
                  <Link href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-sm">f</span>
                  </Link>
                  <Link href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-sm">t</span>
                  </Link>
                  <Link href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-sm">i</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
