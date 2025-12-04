'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 });
  const [forecast, setForecast] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'ai') fetchRecommendations();
    if (activeTab === 'analytics') fetchAnalytics();
  }, [activeTab]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/inventory?lowStock=true`);
      const data = await res.json();
      setInventory(data.data || []);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/inventory/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/forecast/recommendations`);
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/forecast/analytics?days=30`);
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateForecast = async (days) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/forecast/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horizon_days: days }),
      });
      const data = await res.json();
      setForecast(data.forecast);
    } catch (err) {
      console.error('Failed to generate forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Admin
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border mb-6 overflow-x-auto">
            {['inventory', 'ai', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-text-primary'
                }`}
              >
                {tab === 'inventory' && 'Inventory'}
                {tab === 'ai' && 'AI Predictions'}
                {tab === 'analytics' && 'Analytics'}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Icon name="ArrowPathIcon" size={32} className="animate-spin text-primary" />
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && !loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon name="CubeIcon" size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                      <p className="text-sm text-muted-foreground">Total Products</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Icon name="ExclamationTriangleIcon" size={24} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-text-primary">{stats.lowStock}</p>
                      <p className="text-sm text-muted-foreground">Low Stock</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Icon name="XCircleIcon" size={24} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-text-primary">{stats.outOfStock}</p>
                      <p className="text-sm text-muted-foreground">Out of Stock</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-text-primary">Low Stock Products</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">SKU</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3 text-text-primary">{item.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.sku}</td>
                          <td className="px-4 py-3 font-medium text-text-primary">{item.stock_quantity}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.stock_quantity === 0 ? 'bg-red-100 text-red-700' :
                              item.stock_quantity < 5 ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.stock_quantity === 0 ? 'Out of Stock' : item.stock_quantity < 5 ? 'Critical' : 'Low'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* AI Predictions Tab */}
          {activeTab === 'ai' && !loading && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-text-primary mb-4">Generate Demand Forecast</h3>
                <div className="flex flex-wrap gap-3">
                  {[30, 60, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => generateForecast(days)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
                    >
                      {days}-Day Forecast
                    </button>
                  ))}
                </div>

                {forecast && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium text-text-primary mb-2">Forecast Summary</h4>
                    <p className="text-muted-foreground">{forecast.summary}</p>
                    {forecast.recommendations && (
                      <ul className="mt-3 space-y-1">
                        {forecast.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Icon name="CheckCircleIcon" size={16} className="text-green-500 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-text-primary mb-4">Reorder Recommendations</h3>
                {recommendations.length === 0 ? (
                  <p className="text-muted-foreground">All products are well stocked!</p>
                ) : (
                  <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                      <div key={i} className="p-4 border border-border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-text-primary">{rec.product_name}</p>
                            <p className="text-sm text-muted-foreground">Current: {rec.current_stock} units</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.urgency === 'high' ? 'bg-red-100 text-red-700' :
                            rec.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {rec.urgency}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{rec.reasoning}</p>
                        <p className="mt-1 font-medium text-primary">Recommended order: {rec.recommended_order} units</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && !loading && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Period</p>
                  <p className="text-xl font-bold text-text-primary">{analytics?.period_days || 30} Days</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-xl font-bold text-text-primary">{analytics?.total_orders || 0}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-xl font-bold text-green-600">₹{(analytics?.total_revenue || 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Items Sold</p>
                  <p className="text-xl font-bold text-text-primary">{analytics?.total_items_sold || 0}</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-text-primary mb-4">Revenue Insights</h3>
                <p className="text-muted-foreground">
                  Average order value: <span className="font-semibold text-primary">₹{(analytics?.average_order_value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
