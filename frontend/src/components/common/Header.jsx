'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Header({ onSearchSubmit, onCartClick }) {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef(null);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    router.push('/homepage');
  };

  const navigationItems = [
    { label: 'Products', path: '/product-listing', icon: 'ShoppingBagIcon' },
    { label: 'About Us', path: '/about', icon: 'InformationCircleIcon' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef?.current) {
      searchInputRef?.current?.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      // Navigate to product listing with search query
      router.push(`/product-listing?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-smooth ${
          isScrolled ? 'glass-card shadow-lg' : 'bg-background'
        }`}
      >
        <div className="w-full">
          <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <Link href="/homepage" prefetch={true} className="flex items-center gap-2 hover-scale">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
                  <Icon name="CubeIcon" size={20} className="text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-primary font-heading hidden sm:block">
                  InventoryPredictor
                </span>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {navigationItems?.map((item) => (
                  <Link
                    key={item?.path}
                    href={item?.path}
                    prefetch={true}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary hover:text-accent transition-micro rounded-md hover:bg-muted"
                  >
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/shopping-cart"
                  prefetch={true}
                  onClick={handleCartClick}
                  className="relative flex items-center justify-center w-10 h-10 text-text-primary hover:text-accent transition-micro rounded-md hover:bg-muted"
                >
                  <Icon name="ShoppingCartIcon" size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-semibold text-primary-foreground bg-accent rounded-full animate-scale-in">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-10 h-10 text-text-primary hover:text-accent transition-micro rounded-md hover:bg-muted"
                  aria-label="Toggle theme"
                >
                  <Icon name={theme === 'dark' ? 'SunIcon' : 'MoonIcon'} size={20} />
                </button>

                {/* Profile Icon */}
                <div className="relative" ref={profileRef}>
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center justify-center w-10 h-10 text-text-primary hover:text-accent transition-micro rounded-md hover:bg-muted"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                          {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      </button>
                      {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                          <div className="px-4 py-2 border-b border-border">
                            <p className="font-medium text-text-primary">{profile?.full_name || 'User'}</p>
                            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                          </div>
                          <Link
                            href="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-muted"
                          >
                            <Icon name="UserCircleIcon" size={18} />
                            My Profile
                          </Link>
                          <Link
                            href="/profile?tab=orders"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-muted"
                          >
                            <Icon name="ClipboardDocumentListIcon" size={18} />
                            My Orders
                          </Link>
                          {profile?.is_admin && (
                            <Link
                              href="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-muted"
                            >
                              <Icon name="Cog6ToothIcon" size={18} />
                              Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-muted"
                          >
                            <Icon name="ArrowRightOnRectangleIcon" size={18} />
                            Logout
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center justify-center w-10 h-10 text-text-primary hover:text-accent transition-micro rounded-md hover:bg-muted"
                    >
                      <Icon name="UserCircleIcon" size={22} />
                    </Link>
                  )}
                </div>
              </div>

              <button
                onClick={handleMobileMenuToggle}
                className="flex lg:hidden items-center justify-center w-10 h-10 text-text-primary hover:text-accent transition-micro rounded-md hover:bg-muted"
              >
                <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          onClick={handleMobileMenuToggle}
        />
        
        {/* Menu Content */}
        <div className={`relative h-full flex flex-col transition-all duration-500 delay-100 ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}>
          {/* Close Button */}
          <div className="flex justify-end p-6">
            <button
              onClick={handleMobileMenuToggle}
              className="w-12 h-12 flex items-center justify-center text-white hover:text-neutral-300 transition-colors"
            >
              <Icon name="XMarkIcon" size={32} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-8 mb-8">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  placeholder="Search products..."
                  className="w-full h-14 pl-14 pr-6 text-lg bg-white/10 border border-white/20 rounded-none text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                />
                <Icon
                  name="MagnifyingGlassIcon"
                  size={24}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50"
                />
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center px-8 -mt-20">
            {navigationItems?.map((item, index) => (
              <Link
                key={item?.path}
                href={item?.path}
                prefetch={true}
                onClick={handleMobileMenuToggle}
                className={`group flex items-center gap-6 py-5 border-b border-white/10 transition-all duration-300 delay-${index * 100} ${
                  isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: `${150 + index * 50}ms` }}
              >
                <Icon name={item?.icon} size={28} className="text-white/60 group-hover:text-white transition-colors" />
                <span className="text-3xl font-light text-white tracking-wide group-hover:translate-x-2 transition-transform">
                  {item?.label}
                </span>
              </Link>
            ))}
            <Link
              href="/shopping-cart"
              prefetch={true}
              onClick={handleMobileMenuToggle}
              className={`group flex items-center gap-6 py-5 border-b border-white/10 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <Icon name="ShoppingCartIcon" size={28} className="text-white/60 group-hover:text-white transition-colors" />
              <span className="text-3xl font-light text-white tracking-wide group-hover:translate-x-2 transition-transform">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="ml-auto flex items-center justify-center min-w-[32px] h-[32px] px-2 text-sm font-semibold text-black bg-white rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Bottom Actions */}
          <div className="px-8 pb-12">
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                onClick={() => { toggleTheme(); handleMobileMenuToggle(); }}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              >
                <Icon name={theme === 'dark' ? 'SunIcon' : 'MoonIcon'} size={24} />
                <span className="text-lg font-light">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              
              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); handleMobileMenuToggle(); }}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <Icon name="ArrowRightOnRectangleIcon" size={24} />
                  <span className="text-lg font-light">Logout</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={handleMobileMenuToggle}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <Icon name="UserCircleIcon" size={24} />
                  <span className="text-lg font-light">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
