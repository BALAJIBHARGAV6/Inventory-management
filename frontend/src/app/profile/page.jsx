'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile, getOrders } from '@/lib/supabase';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Icon from '@/components/ui/AppIcon';

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, isAuthenticated, loading: authLoading, refreshProfile } = useAuth();
  
  // Get initial tab from URL or default to 'profile'
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'orders' ? 'orders' : 'profile');
  const [orders, setOrders] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Update tab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'orders') {
      setActiveTab('orders');
    }
  }, [searchParams]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  // Fetch orders when tab changes or on mount
  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        console.log('Fetching orders for user:', user.id);
        const { data, error } = await getOrders(user.id);
        if (error) {
          console.error('Error fetching orders:', error);
        }
        setOrders(data || []);
      } else {
        setOrders([]);
      }
    };
    
    // Fetch orders on mount and when tab changes
    fetchOrders();
    
    // Poll for updates every 10 seconds when on orders tab
    let interval;
    if (activeTab === 'orders') {
      interval = setInterval(fetchOrders, 10000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, user?.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { data, error } = await updateUserProfile(user.id, formData);
      if (error) {
        console.error('Profile update error:', error);
        setMessage('Failed to update profile: ' + (error.message || 'Unknown error'));
      } else {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        // Refresh the profile in AuthContext so it persists
        try {
          await refreshProfile();
        } catch (refreshErr) {
          console.log('Profile refresh skipped:', refreshErr);
        }
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Profile update exception:', err);
      setMessage('An error occurred while updating profile');
    }
    // Always reset saving state
    setSaving(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="ArrowPathIcon" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-text-primary mb-6">My Account</h1>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-text-primary'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-text-primary'
              }`}
            >
              Orders
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="bg-card border border-border rounded-xl p-6">
              {/* Profile Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg">
                    {formData.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">{formData.full_name || 'User'}</h2>
                    <p className="text-muted-foreground text-sm">{user?.email}</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="h-10 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Icon name="PencilIcon" size={16} />
                    Edit Profile
                  </button>
                )}
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 mb-4 ${message.includes('success') ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                  <Icon name={message.includes('success') ? 'CheckCircleIcon' : 'ExclamationCircleIcon'} size={18} />
                  {message}
                </div>
              )}

              {/* View Mode */}
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name</label>
                      <p className="text-text-primary font-medium">{formData.full_name || 'Not set'}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                      <p className="text-text-primary font-medium">{user?.email}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Phone Number</label>
                      <p className="text-text-primary font-medium">{formData.phone || 'Not set'}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Delivery Address</label>
                      <p className="text-text-primary font-medium">{formData.address || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full h-11 px-4 border border-input rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Delivery Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        placeholder="Enter your delivery address"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="h-11 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? <Icon name="ArrowPathIcon" size={18} className="animate-spin" /> : <Icon name="CheckIcon" size={18} />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form to original profile data
                        setFormData({
                          full_name: profile?.full_name || '',
                          phone: profile?.phone || '',
                          address: profile?.address || '',
                        });
                      }}
                      className="h-11 px-6 bg-muted text-text-primary rounded-lg font-medium hover:bg-muted/80 transition-colors flex items-center gap-2"
                    >
                      <Icon name="XMarkIcon" size={18} />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                  <Icon name="ShoppingBagIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                  <button
                    onClick={() => router.push('/product-listing')}
                    className="h-10 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id || order.order_number} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-text-primary text-lg">Order #{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                      </span>
                    </div>
                    
                    {/* Order Items Preview */}
                    {order.items && order.items.length > 0 && (
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {order.items.slice(0, 4).map((item, idx) => (
                          <img 
                            key={idx}
                            src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-muted-foreground">+{order.items.length - 4}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <div>
                        <p className="text-xl font-bold text-text-primary">₹{order.total?.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-muted-foreground">
                          {(order.items?.length || order.order_items?.length || 1)} items • Cash on Delivery
                        </p>
                      </div>
                      {order.shipping_address && (
                        <div className="text-right text-xs text-muted-foreground">
                          <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
