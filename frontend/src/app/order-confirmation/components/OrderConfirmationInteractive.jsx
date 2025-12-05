'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

export default function OrderConfirmationInteractive({ orderData }) {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch orders from database
    setLoading(false);
    setOrders([]); // Empty orders - no dummy data
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20">
            <div className="max-w-md mx-auto text-center">
              <div className="w-24 h-24 mx-auto mb-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name="UserCircleIcon" size={48} className="text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-4">
                Sign In Required
              </h1>
              <p className="text-text-secondary mb-8">
                Please sign in to view your orders.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                <Icon name="ArrowRightOnRectangleIcon" size={20} />
                Sign In
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              My Orders
            </h1>
            <p className="text-lg text-text-secondary">
              Track and manage your orders
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-32 h-32 mx-auto mb-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name="ClipboardDocumentListIcon" size={64} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                No Orders Yet
              </h2>
              <p className="text-text-secondary mb-8">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link
                href="/product-listing"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                <Icon name="ShoppingBagIcon" size={20} />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-xl p-6">
                  {/* Order content would go here */}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
