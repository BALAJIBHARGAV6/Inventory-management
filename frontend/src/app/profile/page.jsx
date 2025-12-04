'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile, getOrders } from '@/lib/supabase';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
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

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        const { data } = await getOrders(user.id);
        setOrders(data || []);
      }
    };
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, user?.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { error } = await updateUserProfile(user.id, formData);
      if (error) {
        setMessage('Failed to update profile');
      } else {
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setSaving(false);
    }
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
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {formData.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">{formData.full_name || 'User'}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-11 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-24 px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
                    placeholder="Enter your delivery address"
                  />
                </div>

                {message && (
                  <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <Icon name="ArrowPathIcon" size={18} className="animate-spin" /> : <Icon name="CheckIcon" size={18} />}
                  Save Changes
                </button>
              </form>
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
                  <div key={order.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-text-primary">Order #{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <p className="text-lg font-semibold text-text-primary">₹{order.total?.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-muted-foreground">{order.order_items?.length || 0} items</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
