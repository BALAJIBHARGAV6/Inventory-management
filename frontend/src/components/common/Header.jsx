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
    { label: 'Orders', path: '/order-confirmation', icon: 'ClipboardDocumentListIcon' },
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
    if (searchQuery?.trim() && onSearchSubmit) {
      onSearchSubmit(searchQuery);
      setIsSearchExpanded(false);
      setSearchQuery('');
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
              <Link href="/homepage" className="flex items-center gap-2 hover-scale">
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
                {isSearchExpanded ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e?.target?.value)}
                        placeholder="Search products..."
                        className="w-64 h-10 pl-10 pr-4 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                      />
                      <Icon
                        name="MagnifyingGlassIcon"
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSearchToggle}
                      className="flex items-center justify-center w-10 h-10 text-text-primary hover:text-accent transition-micro rounded-md hover:bg-muted"
                    >
                      <Icon name="XMarkIcon" size={20} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={handleSearchToggle}
                    className="flex items-center justify-center w-10 h-10 text-text-primary hover:text-accent transition-micro rounded-md hover:bg-muted"
                  >
                    <Icon name="MagnifyingGlassIcon" size={20} />
                  </button>
                )}

                <Link
                  href="/shopping-cart"
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
                            href="/order-confirmation"
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

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[90] bg-foreground/20 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={handleMobileMenuToggle}
        />
      )}

      <div
        className={`fixed top-16 right-0 bottom-0 z-[95] w-80 bg-background shadow-modal lg:hidden transition-smooth ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                placeholder="Search products..."
                className="w-full h-12 pl-12 pr-4 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              />
              <Icon
                name="MagnifyingGlassIcon"
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </form>

          <nav className="flex flex-col gap-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                href={item?.path}
                onClick={handleMobileMenuToggle}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-text-primary hover:text-accent transition-micro rounded-md hover:bg-muted"
              >
                <Icon name={item?.icon} size={22} />
                <span>{item?.label}</span>
              </Link>
            ))}
            <Link
              href="/shopping-cart"
              onClick={handleMobileMenuToggle}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-text-primary hover:text-accent transition-micro rounded-md hover:bg-muted"
            >
              <Icon name="ShoppingCartIcon" size={22} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="ml-auto flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-semibold text-primary-foreground bg-accent rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => { toggleTheme(); handleMobileMenuToggle(); }}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-text-primary hover:text-accent transition-micro rounded-md hover:bg-muted w-full text-left"
            >
              <Icon name={theme === 'dark' ? 'SunIcon' : 'MoonIcon'} size={22} />
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
