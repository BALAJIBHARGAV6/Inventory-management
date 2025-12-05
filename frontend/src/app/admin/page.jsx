'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0, totalValue: 0, criticalStock: 0 });
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [productRecommendations, setProductRecommendations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, approved: 0, totalRevenue: 0 });
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock_quantity: '',
    brand: '',
    sku: '',
    thumbnail: '',
    category_id: '',
    is_featured: false
  });

  useEffect(() => {
    fetchProducts();
    fetchInventory();
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'ai') {
      fetchRecommendations();
    } else if (activeTab === 'orders') {
      fetchOrders();
      fetchOrderStats();
    } else if (activeTab === 'analytics') {
      fetchOrderStats();
      fetchAIInsights();
    }
  }, [activeTab]);

  const fetchAIInsights = async () => {
    setAiLoading(true);
    try {
      console.log('Fetching AI insights...');
      const res = await fetch(`${API_URL}/api/forecast/ai-analytics`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('AI Insights:', data);
      setAiInsights(data.insights);
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
      setAiInsights(null);
    } finally {
      setAiLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log('Fetching products from:', `${API_URL}/api/products?limit=100`);
      const res = await fetch(`${API_URL}/api/products?limit=100`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Products response:', data);
      setProducts(data.products || []);
      
      if (data.products && data.products.length > 0) {
        console.log('Successfully loaded', data.products.length, 'products');
      } else {
        console.warn('No products found in response');
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      // Set empty array if API fails - no mock data
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      console.log('Fetching inventory from:', `${API_URL}/api/inventory`);
      const res = await fetch(`${API_URL}/api/inventory`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Inventory response:', data);
      setInventory(data.data || []);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      setInventory([]);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('Fetching stats from:', `${API_URL}/api/inventory/stats`);
      const res = await fetch(`${API_URL}/api/inventory/stats`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Stats response:', data);
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setStats({ total: 0, lowStock: 0, outOfStock: 0, totalValue: 0, criticalStock: 0 });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          original_price: parseFloat(newProduct.original_price),
          stock_quantity: parseInt(newProduct.stock_quantity)
        }),
      });
      
      if (res.ok) {
        setShowAddProduct(false);
        setNewProduct({
          name: '', description: '', price: '', original_price: '', 
          stock_quantity: '', brand: '', sku: '', thumbnail: '', 
          category_id: '', is_featured: false
        });
        fetchProducts();
        fetchInventory();
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to add product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId, newQuantity) => {
    try {
      const currentProduct = inventory.find(p => p.id === productId);
      const qtyChange = newQuantity - currentProduct.stock_quantity;
      
      const res = await fetch(`${API_URL}/api/inventory/${productId}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qtyChange }),
      });
      
      if (res.ok) {
        fetchInventory();
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
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

  const fetchProductRecommendations = async () => {
    try {
      console.log('Fetching product recommendations from:', `${API_URL}/api/forecast/product-recommendations`);
      const res = await fetch(`${API_URL}/api/forecast/product-recommendations`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Product recommendations response:', data);
      setProductRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Failed to fetch product recommendations:', err);
      setProductRecommendations([]);
    }
  };

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders from backend API...');
      const res = await fetch(`${API_URL}/api/orders/admin/all`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Orders fetched:', data.orders?.length || 0, 'orders');
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    }
  };

  const fetchOrderStats = async () => {
    try {
      console.log('Fetching order stats from backend API...');
      const res = await fetch(`${API_URL}/api/orders/admin/stats`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Order stats:', data);
      setOrderStats(data);
    } catch (err) {
      console.error('Failed to fetch order stats:', err);
      setOrderStats({ total: 0, pending: 0, approved: 0, totalRevenue: 0 });
    }
  };

  const approveOrder = async (orderId, adminNotes = '') => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to approve order');
      }
      
      const data = await res.json();
      console.log('Order approved:', data);
      
      // Refresh orders and stats
      await fetchOrders();
      await fetchOrderStats();
      await fetchStats(); // Refresh inventory stats too
      
      return data;
    } catch (err) {
      console.error('Failed to approve order:', err);
      throw err;
    }
  };

  const rejectOrder = async (orderId, reason = '', adminNotes = '') => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, adminNotes }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to reject order');
      }
      
      const data = await res.json();
      console.log('Order rejected:', data);
      
      // Refresh orders and stats
      await fetchOrders();
      await fetchOrderStats();
      
      return data;
    } catch (err) {
      console.error('Failed to reject order:', err);
      throw err;
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 md:pt-28 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                Admin
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 md:gap-2 border-b border-border mb-6 overflow-x-auto pb-px scrollbar-hide">
            {['dashboard', 'products', 'inventory', 'orders', 'ai', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-3 md:px-4 font-medium whitespace-nowrap transition-all text-sm md:text-base ${
                  activeTab === tab
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-muted-foreground hover:text-text-primary'
                }`}
              >
                {tab === 'dashboard' && 'Dashboard'}
                {tab === 'products' && 'Products'}
                {tab === 'inventory' && 'Inventory'}
                {tab === 'orders' && 'Orders'}
                {tab === 'ai' && 'AI Forecasting'}
                {tab === 'analytics' && 'Analytics'}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Icon name="ArrowPathIcon" size={32} className="animate-spin text-primary" />
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && !loading && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-primary">Dashboard Overview</h2>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Live Data</span>
                </div>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Products</p>
                      <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Active inventory</p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-full shadow-lg">
                      <Icon name="CubeIcon" size={24} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Low Stock</p>
                      <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.lowStock}</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Need restocking</p>
                    </div>
                    <div className="p-3 bg-orange-500 rounded-full shadow-lg">
                      <Icon name="ExclamationTriangleIcon" size={24} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">Critical Stock</p>
                      <p className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.criticalStock}</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">Urgent attention</p>
                    </div>
                    <div className="p-3 bg-red-500 rounded-full shadow-lg">
                      <Icon name="XCircleIcon" size={24} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Value</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">₹{(stats.totalValue || 0).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Inventory worth</p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-full shadow-lg">
                      <Icon name="CurrencyRupeeIcon" size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              {stats.averageValue && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="ChartBarIcon" size={20} className="text-purple-500" />
                      <h3 className="font-semibold text-text-primary">Avg Product Value</h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">₹{stats.averageValue?.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="StarIcon" size={20} className="text-yellow-500" />
                      <h3 className="font-semibold text-text-primary">Top Category</h3>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{stats.topCategory}</p>
                  </div>
                  
                  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="TrophyIcon" size={20} className="text-indigo-500" />
                      <h3 className="font-semibold text-text-primary">Premium Items</h3>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">{stats.highValueProducts || 0}</p>
                    <p className="text-sm text-muted-foreground">₹{stats.premiumInventoryValue?.toLocaleString('en-IN')} worth</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Icon name="ClockIcon" size={20} />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <Icon name="CheckCircleIcon" size={20} className="text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">Stock Updated</p>
                        <p className="text-xs text-muted-foreground">Gaming Mouse inventory updated</p>
                      </div>
                      <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded">2m ago</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <Icon name="ExclamationTriangleIcon" size={20} className="text-orange-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">Low Stock Alert</p>
                        <p className="text-xs text-muted-foreground">PlayStation 5 below threshold</p>
                      </div>
                      <span className="text-xs text-orange-600 bg-orange-100 dark:bg-orange-900/40 px-2 py-1 rounded">5m ago</span>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <Icon name="SparklesIcon" size={20} className="text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">AI Forecast Ready</p>
                        <p className="text-xs text-muted-foreground">Winter season predictions available</p>
                      </div>
                      <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">10m ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Icon name="RocketLaunchIcon" size={20} />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowAddProduct(true)}
                      className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <Icon name="PlusIcon" size={20} />
                      <span className="font-medium">Add New Product</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('inventory')}
                      className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:shadow-md"
                    >
                      <Icon name="ClipboardDocumentListIcon" size={20} />
                      <span className="font-medium">Manage Inventory</span>
                    </button>

                    <button 
                      onClick={() => {
                        setActiveTab('ai');
                        fetchProductRecommendations();
                      }}
                      className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <Icon name="SparklesIcon" size={20} />
                      <span className="font-medium">AI Product Suggestions</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Product Recommendations Preview */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon name="SparklesIcon" size={24} className="text-purple-600" />
                    <h3 className="text-lg font-semibold text-text-primary">AI Product Recommendations</h3>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs rounded-full">Beta</span>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('ai');
                      fetchProductRecommendations();
                    }}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Based on Indian market trends, seasonal patterns, and your current inventory gaps, here are AI-powered product suggestions to boost sales:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <h4 className="font-semibold text-text-primary">Apple iPad 10th Gen</h4>
                    <p className="text-sm text-muted-foreground">₹35,000 - ₹45,000 • High Demand</p>
                    <p className="text-xs text-purple-600 mt-1">Missing tablet category • Student season approaching</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <h4 className="font-semibold text-text-primary">boAt Airdopes 800 TWS</h4>
                    <p className="text-sm text-muted-foreground">₹2,000 - ₹4,000 • Very High Demand</p>
                    <p className="text-xs text-purple-600 mt-1">Audio market leader • Consistent growth</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && !loading && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-text-primary">Product Management</h2>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Icon name="PlusIcon" size={20} />
                  Add Product
                </button>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">SKU</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={product.thumbnail || 'https://via.placeholder.com/40'} 
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-text-primary">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{product.sku}</td>
                          <td className="px-4 py-3 font-medium text-text-primary">₹{product.price?.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 font-medium text-text-primary">{product.stock_quantity}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.stock_quantity === 0 ? 'bg-red-100 text-red-700' :
                              product.stock_quantity < 10 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {product.stock_quantity === 0 ? 'Out of Stock' : 
                               product.stock_quantity < 10 ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-muted rounded">
                                <Icon name="PencilIcon" size={16} className="text-muted-foreground" />
                              </button>
                              <button className="p-1 hover:bg-muted rounded">
                                <Icon name="TrashIcon" size={16} className="text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && !loading && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Inventory Management</h2>
              
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Current Stock</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reorder Level</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Value</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.thumbnail || 'https://via.placeholder.com/40'} 
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-text-primary">{item.name}</p>
                                <p className="text-sm text-muted-foreground">{item.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-text-primary">{item.stock_quantity}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.reorder_level}</td>
                          <td className="px-4 py-3 font-medium text-text-primary">₹{(item.price * item.stock_quantity).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.stock_quantity === 0 ? 'bg-red-100 text-red-700' :
                              item.stock_quantity <= 5 ? 'bg-orange-100 text-orange-700' :
                              item.stock_quantity <= item.reorder_level ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {item.stock_quantity === 0 ? 'Out of Stock' : 
                               item.stock_quantity <= 5 ? 'Critical' :
                               item.stock_quantity <= item.reorder_level ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                defaultValue={item.stock_quantity}
                                className="w-20 px-2 py-1 border border-input rounded text-sm"
                                onBlur={(e) => {
                                  const newQty = parseInt(e.target.value);
                                  if (newQty !== item.stock_quantity) {
                                    handleUpdateStock(item.id, newQty);
                                  }
                                }}
                              />
                              <button 
                                onClick={() => handleUpdateStock(item.id, item.stock_quantity + 10)}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && !loading && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-primary">Order Management</h2>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Real-time Orders</span>
                </div>
              </div>

              {/* Order Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Orders</p>
                      <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{orderStats.total}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">All time</p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-full shadow-lg">
                      <Icon name="ShoppingBagIcon" size={24} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Pending Orders</p>
                      <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{orderStats.pending}</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Awaiting approval</p>
                    </div>
                    <div className="p-3 bg-orange-500 rounded-full shadow-lg">
                      <Icon name="ClockIcon" size={24} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Approved Orders</p>
                      <p className="text-3xl font-bold text-green-900 dark:text-green-100">{orderStats.approved}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Ready to process</p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-full shadow-lg">
                      <Icon name="CheckCircleIcon" size={24} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">₹{orderStats.totalRevenue?.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">All orders</p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-full shadow-lg">
                      <Icon name="CurrencyRupeeIcon" size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">Recent Orders</h3>
                    <button
                      onClick={() => {
                        fetchOrders();
                        fetchOrderStats();
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Order</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Items</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Total</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center">
                            <Icon name="ShoppingBagIcon" size={48} className="text-muted-foreground mx-auto mb-3" />
                            <p className="text-lg font-medium text-text-primary mb-2">No Orders Found</p>
                            <p className="text-muted-foreground">Orders will appear here when customers place them.</p>
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-text-primary">{order.order_number}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.payment_method || 'Cash on Delivery'}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-text-primary">
                                  {order.shipping_address?.full_name || order.customer_name || 'N/A'}
                                </p>
                                {(order.customer_email || order.shipping_address?.email) && (
                                  <p className="text-sm text-muted-foreground">
                                    {order.customer_email || order.shipping_address?.email}
                                  </p>
                                )}
                                {(order.customer_phone || order.shipping_address?.phone) && (
                                  <p className="text-sm text-muted-foreground">
                                    {order.customer_phone || order.shipping_address?.phone}
                                  </p>
                                )}
                                {(order.shipping_address?.city || order.shipping_address?.state) && (
                                  <p className="text-sm text-muted-foreground">
                                    {order.shipping_address?.city}{order.shipping_address?.city && order.shipping_address?.state ? ', ' : ''}{order.shipping_address?.state}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-text-primary">
                                  {order.order_items?.length || 0} items
                                </p>
                                {order.order_items?.[0] && (
                                  <p className="text-sm text-muted-foreground">
                                    {order.order_items[0].product_name || order.order_items[0].products?.name || 'Product'}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-text-primary">
                                ₹{(order.total || order.total_amount || 0).toLocaleString('en-IN')}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                order.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                order.status === 'shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {order.status?.toUpperCase() || 'PENDING'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at || new Date()).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-2">
                                {order.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={async () => {
                                        const confirmed = confirm(
                                          `Approve order ${order.order_number}?\n\n` +
                                          `Customer: ${order.shipping_address?.full_name || 'N/A'}\n` +
                                          `Amount: ₹${(order.total || 0).toLocaleString('en-IN')}\n` +
                                          `Items: ${order.order_items?.length || 0}\n\n` +
                                          `This will update inventory automatically.`
                                        );
                                        if (confirmed) {
                                          try {
                                            await approveOrder(order.id, 'Order approved by admin - inventory updated');
                                            alert('✅ Order approved successfully!\n📦 Inventory has been updated automatically.');
                                          } catch (err) {
                                            alert('❌ Failed to approve order: ' + err.message);
                                          }
                                        }
                                      }}
                                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
                                    >
                                      ✅ Approve Order
                                    </button>
                                    <button
                                      onClick={async () => {
                                        const reason = prompt(
                                          `Reject order ${order.order_number}?\n\n` +
                                          `Please provide a reason for rejection:`
                                        );
                                        if (reason) {
                                          const confirmed = confirm(
                                            `Confirm rejection of order ${order.order_number}?\n\n` +
                                            `Reason: ${reason}\n\n` +
                                            `Customer will be notified.`
                                          );
                                          if (confirmed) {
                                            try {
                                              await rejectOrder(order.id, reason, 'Order rejected by admin');
                                              alert('❌ Order rejected successfully!\n📧 Customer has been notified.');
                                            } catch (err) {
                                              alert('Failed to reject order: ' + err.message);
                                            }
                                          }
                                        }
                                      }}
                                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
                                    >
                                      ❌ Reject Order
                                    </button>
                                  </>
                                )}
                                {order.status !== 'pending' && (
                                  <div className="text-center">
                                    <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                      order.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                      order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                      {order.status === 'approved' ? '✅ Approved' :
                                       order.status === 'cancelled' ? '❌ Rejected' :
                                       '📦 Processing'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Management Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Icon name="InformationCircleIcon" size={20} className="text-blue-600" />
                  Order Management Tips
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-text-primary mb-2">Approval Process</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Review order details before approval</li>
                      <li>• Check inventory availability</li>
                      <li>• Verify customer information</li>
                      <li>• Inventory is automatically updated on approval</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-text-primary mb-2">Best Practices</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Process orders within 24 hours</li>
                      <li>• Add notes for special instructions</li>
                      <li>• Monitor pending orders regularly</li>
                      <li>• Communicate with customers promptly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Forecasting Tab */}
          {activeTab === 'ai' && !loading && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-text-primary">AI Inventory Forecasting</h2>
              
              {/* Generate Forecast Section */}
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">Generate AI Demand Forecast</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Use AI to predict future demand and get intelligent restocking recommendations.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {[30, 60, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => generateForecast(days)}
                      disabled={loading}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm sm:text-base"
                    >
                      {days}-Day
                    </button>
                  ))}
                </div>

                {forecast && (
                  <div className="bg-muted/30 rounded-lg p-4 sm:p-6 border border-border">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <Icon name="SparklesIcon" size={24} className="text-primary" />
                      <h4 className="text-base sm:text-lg font-semibold text-text-primary">AI Market Intelligence</h4>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {forecast.methodology ? 'Indian Market' : 'Global'}
                      </span>
                    </div>
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-card p-3 sm:p-4 rounded-lg border">
                        <p className="text-xs sm:text-sm text-muted-foreground">Products</p>
                        <p className="text-xl sm:text-2xl font-bold text-text-primary">{forecast.total_products_analyzed}</p>
                      </div>
                      <div className="bg-card p-3 sm:p-4 rounded-lg border">
                        <p className="text-xs sm:text-sm text-muted-foreground">Confidence</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600">{Math.round((forecast.confidence_score || 0.85) * 100)}%</p>
                      </div>
                      <div className="bg-card p-3 sm:p-4 rounded-lg border">
                        <p className="text-xs sm:text-sm text-muted-foreground">Season</p>
                        <p className="text-base sm:text-lg font-bold text-primary capitalize">{forecast.seasonal_context?.current_season || 'Winter'}</p>
                      </div>
                      <div className="bg-card p-3 sm:p-4 rounded-lg border">
                        <p className="text-xs sm:text-sm text-muted-foreground">Festival</p>
                        <p className="text-base sm:text-lg font-bold text-orange-600">{forecast.seasonal_context?.festival_impact?.multiplier ? `${forecast.seasonal_context.festival_impact.multiplier}x` : '1.0x'}</p>
                      </div>
                    </div>

                    {/* Seasonal Context */}
                    {forecast.seasonal_context && (
                      <div className="bg-card p-3 sm:p-4 rounded-lg border mb-4 sm:mb-6">
                        <h5 className="text-sm sm:text-base font-semibold text-text-primary mb-2 sm:mb-3 flex items-center gap-2">
                          <Icon name="CalendarIcon" size={16} />
                          Seasonal Intelligence
                        </h5>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Current Season</p>
                            <p className="text-sm sm:text-base font-medium text-text-primary capitalize">{forecast.seasonal_context.current_season}</p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Festival Period</p>
                            <p className="text-sm sm:text-base font-medium text-text-primary">
                              {forecast.seasonal_context.festival_impact?.current?.name || 'Regular Period'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Market Intelligence */}
                    {forecast.market_intelligence && (
                      <div className="bg-card p-3 sm:p-4 rounded-lg border mb-4 sm:mb-6">
                        <h5 className="text-sm sm:text-base font-semibold text-text-primary mb-2 sm:mb-3 flex items-center gap-2">
                          <Icon name="TrendingUpIcon" size={16} />
                          Market Intelligence
                        </h5>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Economic</p>
                            <p className="text-xs sm:text-sm text-text-primary">GDP: {forecast.market_intelligence.economic_trends?.gdp_growth}%</p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Consumer</p>
                            <p className="text-xs sm:text-sm text-text-primary">Online: {forecast.market_intelligence.consumer_behavior?.online_preference}</p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Supply</p>
                            <p className="text-xs sm:text-sm text-text-primary">{forecast.market_intelligence.supply_chain_factors?.logistics_efficiency}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Product Insights */}
                    {forecast.product_insights && (
                      <div className="bg-card p-4 rounded-lg border mb-6">
                        <h5 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                          <Icon name="ChartBarIcon" size={16} />
                          Product Insights
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {forecast.product_insights.high_demand_products?.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-red-600 mb-2">High Demand Products</p>
                              {forecast.product_insights.high_demand_products.slice(0, 3).map((product, i) => (
                                <div key={i} className="text-xs text-text-primary mb-1">
                                  <span className="font-medium">{product.name}</span>
                                  <br />
                                  <span className="text-muted-foreground">
                                    Demand: {product.predicted_demand} | Stock: {product.current_stock}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {forecast.product_insights.seasonal_winners?.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-green-600 mb-2">Seasonal Winners</p>
                              {forecast.product_insights.seasonal_winners.slice(0, 3).map((product, i) => (
                                <p key={i} className="text-xs text-text-primary mb-1">{product}</p>
                              ))}
                            </div>
                          )}
                          
                          {forecast.product_insights.at_risk_products?.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-orange-600 mb-2">At Risk Products</p>
                              {forecast.product_insights.at_risk_products.slice(0, 3).map((product, i) => (
                                <p key={i} className="text-xs text-text-primary mb-1">{product}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Forecast Summary */}
                    <div className="mb-6">
                      <h5 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <Icon name="DocumentTextIcon" size={16} />
                        AI Analysis Summary
                      </h5>
                      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border">
                        <p className="text-sm text-text-primary leading-relaxed">{forecast.summary}</p>
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    {forecast.recommendations && forecast.recommendations.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                          <Icon name="LightBulbIcon" size={16} />
                          Intelligent Recommendations
                        </h5>
                        <div className="space-y-3">
                          {forecast.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-card rounded-lg border hover:shadow-sm transition-shadow">
                              <div className="flex-shrink-0 mt-0.5">
                                {rec.includes('🚨') && <span className="text-red-500">🚨</span>}
                                {rec.includes('🌟') && <span className="text-yellow-500">🌟</span>}
                                {rec.includes('🎉') && <span className="text-purple-500">🎉</span>}
                                {rec.includes('📈') && <span className="text-blue-500">📈</span>}
                                {rec.includes('🚛') && <span className="text-green-500">🚛</span>}
                                {!rec.match(/[🚨🌟🎉📈🚛]/) && <Icon name="CheckCircleIcon" size={16} className="text-green-500" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-text-primary leading-relaxed">{rec.replace(/[🚨🌟🎉📈🚛]/g, '').trim()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Methodology */}
                    {forecast.methodology && (
                      <div className="mt-6 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground italic">
                          <Icon name="InformationCircleIcon" size={12} className="inline mr-1" />
                          {forecast.methodology}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Restock Recommendations */}
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-text-primary">Smart Restock Recommendations</h3>
                  <button
                    onClick={fetchRecommendations}
                    disabled={loading}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 text-sm w-full sm:w-auto"
                  >
                    Refresh
                  </button>
                </div>

                {recommendations.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Icon name="CheckCircleIcon" size={40} className="text-green-500 mx-auto mb-3" />
                    <p className="text-base sm:text-lg font-medium text-text-primary mb-2">All Products Well Stocked!</p>
                    <p className="text-sm text-muted-foreground">No immediate restocking needed.</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {recommendations.map((rec, i) => (
                      <div key={i} className="border border-border rounded-lg p-3 sm:p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                          <div>
                            <h4 className="text-sm sm:text-base font-semibold text-text-primary">{rec.product_name}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">Current Stock: {rec.current_stock} units</p>
                          </div>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium w-fit ${
                            rec.urgency === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            rec.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {rec.urgency?.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3">
                          <div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Order Qty</p>
                            <p className="text-xs sm:text-sm font-semibold text-primary">{rec.recommended_order} units</p>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Days Left</p>
                            <p className="text-xs sm:text-sm font-semibold text-text-primary">{rec.estimated_days_until_stockout || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Cost</p>
                            <p className="text-xs sm:text-sm font-semibold text-text-primary">₹{(rec.reorder_cost || 0).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{rec.reasoning}</p>
                        
                        {rec.suggested_supplier && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Supplier:</span> {rec.suggested_supplier}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Product Recommendations */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Icon name="SparklesIcon" size={20} className="text-purple-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary">AI Product Recommendations</h3>
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                      Indian Market AI
                    </span>
                  </div>
                  <button
                    onClick={fetchProductRecommendations}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm w-full sm:w-auto"
                  >
                    Generate Suggestions
                  </button>
                </div>

                <div className="mb-4 sm:mb-6">
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    AI-powered product suggestions based on Indian market trends, seasonal patterns, and your inventory gaps.
                  </p>
                </div>

                {productRecommendations.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Icon name="SparklesIcon" size={40} className="text-purple-400 mx-auto mb-3" />
                    <p className="text-base sm:text-lg font-medium text-text-primary mb-2">Generate AI Recommendations</p>
                    <p className="text-sm text-muted-foreground">Click "Generate Suggestions" to get personalized product recommendations.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {productRecommendations.map((rec, i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-1 truncate">{rec.name}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{rec.category}</p>
                          </div>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {rec.priority?.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                          <div className="flex justify-between">
                            <span className="text-xs sm:text-sm text-muted-foreground">Price Range</span>
                            <span className="text-xs sm:text-sm font-medium text-text-primary">{rec.price_range}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs sm:text-sm text-muted-foreground">Expected Demand</span>
                            <span className="text-xs sm:text-sm font-medium text-text-primary">{rec.expected_demand}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs sm:text-sm text-muted-foreground">Expected ROI</span>
                            <span className="text-xs sm:text-sm font-medium text-green-600">{rec.expected_roi}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs sm:text-sm text-muted-foreground">Investment</span>
                            <span className="text-xs sm:text-sm font-medium text-text-primary">₹{rec.investment_required?.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4">
                          <p className="text-xs sm:text-sm text-text-primary leading-relaxed line-clamp-2">
                            <Icon name="LightBulbIcon" size={12} className="inline mr-1 text-purple-600" />
                            {rec.reasoning}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="truncate">Target: {rec.target_audience}</span>
                          <span className="truncate ml-2">Launch: {rec.launch_timing}</span>
                        </div>

                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-purple-200 dark:border-purple-700">
                          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm font-medium">
                            Add to Inventory Plan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Market Insights */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-purple-200 dark:border-purple-700">
                  <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
                    <Icon name="TrendingUpIcon" size={18} className="text-purple-600" />
                    Current Market Insights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h5 className="text-sm sm:text-base font-medium text-text-primary mb-2">Trending Categories</h5>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li>• Audio products (40% growth)</li>
                        <li>• Health & fitness devices</li>
                        <li>• Premium electronics</li>
                      </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h5 className="text-sm sm:text-base font-medium text-text-primary mb-2">Seasonal Factors</h5>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li>• Winter electronics demand</li>
                        <li>• Festival season approaching</li>
                        <li>• Student season prep</li>
                      </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h5 className="text-sm sm:text-base font-medium text-text-primary mb-2">Consumer Behavior</h5>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li>• 85% online preference</li>
                        <li>• High brand consciousness</li>
                        <li>• Review-dependent purchases</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && !loading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                    <Icon name="SparklesIcon" size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary">AI-Powered Analytics</h2>
                    <p className="text-sm text-muted-foreground">Real-time insights powered by AI</p>
                  </div>
                </div>
                <button 
                  onClick={fetchAIInsights}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  <Icon name={aiLoading ? "ArrowPathIcon" : "ArrowPathIcon"} size={16} className={aiLoading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>

              {aiLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <Icon name="SparklesIcon" size={24} className="text-purple-500 animate-pulse" />
                    <span className="text-muted-foreground">AI is analyzing your data...</span>
                  </div>
                </div>
              )}

              {!aiLoading && aiInsights && (
                <>
                  {/* AI Summary Banner */}
                  <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-purple-500/20 rounded-xl">
                        <Icon name="LightBulbIcon" size={24} className="text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-text-primary">AI Business Summary</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            aiInsights.summary?.health_score >= 80 ? 'bg-green-500/20 text-green-400' :
                            aiInsights.summary?.health_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            Health: {aiInsights.summary?.health_score || 0}%
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-text-primary">{aiInsights.summary?.headline}</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics from AI */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-blue-400">Total Orders</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-300">{aiInsights.order_insights?.total || 0}</p>
                      <p className="text-[10px] sm:text-xs text-blue-400/70 mt-1">Conversion: {aiInsights.order_insights?.conversion_rate || 0}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-green-400">Total Revenue</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-300">₹{(aiInsights.revenue_insights?.total_revenue || 0).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] sm:text-xs text-green-400/70 mt-1">Today: ₹{(aiInsights.revenue_insights?.today_revenue || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-purple-400">Avg Order Value</p>
                      <p className="text-xl sm:text-2xl font-bold text-purple-300">₹{(aiInsights.revenue_insights?.avg_order_value || 0).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] sm:text-xs text-purple-400/70 mt-1 truncate">Per product: ₹{(aiInsights.performance_metrics?.revenue_per_product || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-orange-400">Inventory Value</p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-300">₹{(aiInsights.inventory_insights?.total_value || 0).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] sm:text-xs text-orange-400/70 mt-1">Health: {aiInsights.performance_metrics?.inventory_health || 0}%</p>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Order Status Pie Chart */}
                    <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Icon name="ChartPieIcon" size={20} className="text-blue-500" />
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Order Distribution</h3>
                      </div>
                      <div className="h-52 sm:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Pending', value: aiInsights.order_insights?.pending || 0, color: '#f97316' },
                                { name: 'Approved', value: aiInsights.order_insights?.approved || 0, color: '#22c55e' },
                                { name: 'Cancelled', value: aiInsights.order_insights?.cancelled || 0, color: '#ef4444' },
                              ].filter(d => d.value > 0)}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {[
                                { name: 'Pending', value: aiInsights.order_insights?.pending || 0, color: '#f97316' },
                                { name: 'Approved', value: aiInsights.order_insights?.approved || 0, color: '#22c55e' },
                                { name: 'Cancelled', value: aiInsights.order_insights?.cancelled || 0, color: '#ef4444' },
                              ].filter(d => d.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                              labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Inventory Health Bar Chart */}
                    <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Icon name="ChartBarIcon" size={20} className="text-purple-500" />
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Inventory Health</h3>
                      </div>
                      <div className="h-52 sm:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Healthy', value: aiInsights.inventory_insights?.healthy_stock || 0, fill: '#22c55e' },
                              { name: 'Low Stock', value: aiInsights.inventory_insights?.low_stock || 0, fill: '#eab308' },
                              { name: 'Critical', value: aiInsights.inventory_insights?.critical_stock || 0, fill: '#ef4444' },
                              { name: 'Out of Stock', value: aiInsights.inventory_insights?.out_of_stock || 0, fill: '#6b7280' },
                            ]}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                          >
                            <XAxis type="number" stroke="#9ca3af" />
                            <YAxis type="category" dataKey="name" stroke="#9ca3af" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                              labelStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {[
                                { name: 'Healthy', value: aiInsights.inventory_insights?.healthy_stock || 0, fill: '#22c55e' },
                                { name: 'Low Stock', value: aiInsights.inventory_insights?.low_stock || 0, fill: '#eab308' },
                                { name: 'Critical', value: aiInsights.inventory_insights?.critical_stock || 0, fill: '#ef4444' },
                                { name: 'Out of Stock', value: aiInsights.inventory_insights?.out_of_stock || 0, fill: '#6b7280' },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Order Insights */}
                    <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Icon name="ShoppingCartIcon" size={20} className="text-blue-500" />
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Order Insights</h3>
                      </div>
                      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Pending</span>
                          <span className="font-medium text-orange-500">{aiInsights.order_insights?.pending || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Approved</span>
                          <span className="font-medium text-green-500">{aiInsights.order_insights?.approved || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Cancelled</span>
                          <span className="font-medium text-red-500">{aiInsights.order_insights?.cancelled || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Cancellation Rate</span>
                          <span className="font-medium text-text-primary">{aiInsights.order_insights?.cancellation_rate || 0}%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <p className="text-sm text-blue-300">{aiInsights.order_insights?.analysis}</p>
                      </div>
                    </div>

                    {/* Revenue Insights */}
                    <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Icon name="CurrencyRupeeIcon" size={20} className="text-green-500" />
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Revenue Insights</h3>
                      </div>
                      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Today's Orders</span>
                          <span className="font-medium text-text-primary">{aiInsights.revenue_insights?.today_orders || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Today's Revenue</span>
                          <span className="font-medium text-green-500">₹{(aiInsights.revenue_insights?.today_revenue || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Projected Monthly</span>
                          <span className="font-medium text-purple-500">₹{(aiInsights.revenue_insights?.projected_monthly || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Fulfillment Rate</span>
                          <span className="font-medium text-text-primary">{aiInsights.performance_metrics?.order_fulfillment_rate || 0}%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <p className="text-sm text-green-300">{aiInsights.revenue_insights?.analysis}</p>
                      </div>
                    </div>

                    {/* Inventory Insights */}
                    <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Icon name="CubeIcon" size={20} className="text-purple-500" />
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Inventory Insights</h3>
                      </div>
                      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Total Products</span>
                          <span className="font-medium text-text-primary">{aiInsights.inventory_insights?.total_products || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Healthy Stock</span>
                          <span className="font-medium text-green-500">{aiInsights.inventory_insights?.healthy_stock || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Low Stock</span>
                          <span className="font-medium text-yellow-500">{aiInsights.inventory_insights?.low_stock || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Critical Stock</span>
                          <span className="font-medium text-red-500">{aiInsights.inventory_insights?.critical_stock || 0}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-purple-500/10 rounded-lg">
                        <p className="text-sm text-purple-300">{aiInsights.inventory_insights?.analysis}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon name="SparklesIcon" size={20} className="text-amber-500" />
                      <h3 className="text-lg font-semibold text-text-primary">AI Recommendations</h3>
                    </div>
                    <div className="space-y-3">
                      {aiInsights.ai_recommendations?.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-amber-400">{index + 1}</span>
                          </div>
                          <p className="text-text-primary text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Critical Products Alert */}
                  {aiInsights.inventory_insights?.critical_products?.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Icon name="ExclamationTriangleIcon" size={20} className="text-red-500" />
                        <h3 className="text-lg font-semibold text-red-400">Critical Stock Alert</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {aiInsights.inventory_insights.critical_products.map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                            <span className="text-text-primary text-sm font-medium">{product.name}</span>
                            <span className="text-red-400 font-bold">{product.stock} left</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {!aiLoading && !aiInsights && (
                <div className="text-center py-12">
                  <Icon name="ExclamationCircleIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Failed to load AI insights. Click refresh to try again.</p>
                </div>
              )}
            </div>
          )}

          {/* Add Product Modal */}
          {showAddProduct && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-text-primary">Add New Product</h3>
                    <button
                      onClick={() => setShowAddProduct(false)}
                      className="p-2 hover:bg-muted rounded-lg"
                    >
                      <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Product Name *</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Brand</label>
                      <input
                        type="text"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Price *</label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Original Price</label>
                      <input
                        type="number"
                        value={newProduct.original_price}
                        onChange={(e) => setNewProduct({...newProduct, original_price: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Stock Quantity *</label>
                      <input
                        type="number"
                        value={newProduct.stock_quantity}
                        onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">SKU</label>
                      <input
                        type="text"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
                      <select
                        value={newProduct.category_id}
                        onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select Category</option>
                        <option value="1">Electronics</option>
                        <option value="2">Fashion</option>
                        <option value="3">Home & Living</option>
                        <option value="4">Sports</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Thumbnail URL</label>
                    <input
                      type="url"
                      value={newProduct.thumbnail}
                      onChange={(e) => setNewProduct({...newProduct, thumbnail: e.target.value})}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newProduct.is_featured}
                      onChange={(e) => setNewProduct({...newProduct, is_featured: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="featured" className="text-sm text-text-primary">Featured Product</label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                      {loading ? 'Adding...' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
