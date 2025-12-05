'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder } from '@/lib/supabase';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Icon from '@/components/ui/AppIcon';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartCount, clearCart } = useCart();
  const { user, profile, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      router.push('/shopping-cart');
    }
  }, [cart, orderPlaced, router]);

  // Pre-fill from profile
  useEffect(() => {
    if (profile || user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: profile?.full_name || '',
        phone: profile?.phone || '',
        email: user?.email || '',
        address: profile?.address || '',
      }));
    }
  }, [profile, user]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.pincode.trim()) newErrors.pincode = 'Pincode is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (step === 1 && validateShipping()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Generate order number
      const orderNum = 'ORD' + Date.now().toString().slice(-8);
      
      // Create order data
      const orderData = {
        order_number: orderNum,
        user_id: user?.id || 'guest',
        status: 'pending',
        payment_method: 'cod',
        payment_status: 'pending',
        subtotal: subtotal,
        shipping_cost: shipping,
        total: total,
        shipping_address: {
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode,
        },
        items: cart.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.thumbnail || item.image,
        })),
        created_at: new Date().toISOString(),
      };

      // Save order to Supabase
      const { data, error } = await createOrder(orderData);
      
      if (error) {
        console.error('Order creation error:', error);
        alert('Failed to save order to database: ' + error.message);
        setIsProcessing(false);
        return;
      }

      console.log('Order created successfully:', data);

      // Clear cart and show success
      setOrderNumber(orderNum);
      setOrderPlaced(true);
      clearCart();
      setStep(3);
      
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to place order: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Order Success View
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Icon name="CheckCircleIcon" size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Thank you for your order
            </p>
            <p className="text-2xl font-bold text-primary mb-8">
              Order #{orderNumber}
            </p>

            <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Icon name="TruckIcon" size={20} className="text-accent" />
                Delivery Details
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> <span className="text-text-primary">{shippingInfo.fullName}</span></p>
                <p><span className="text-muted-foreground">Phone:</span> <span className="text-text-primary">{shippingInfo.phone}</span></p>
                <p><span className="text-muted-foreground">Address:</span> <span className="text-text-primary">{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</span></p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <Icon name="BanknotesIcon" size={24} className="text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-400">Cash on Delivery</p>
                    <p className="text-sm text-amber-600 dark:text-amber-500">Pay ₹{total.toLocaleString('en-IN')} when your order arrives</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/profile')}
                className="h-12 px-8 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="ClipboardDocumentListIcon" size={20} />
                View Orders
              </button>
              <button
                onClick={() => router.push('/product-listing')}
                className="h-12 px-8 bg-muted text-text-primary rounded-xl font-semibold hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="ShoppingBagIcon" size={20} />
                Continue Shopping
              </button>
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
      <main className="pt-24 md:pt-28 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {step > 1 ? <Icon name="CheckIcon" size={20} /> : '1'}
                </div>
                <span className="hidden sm:block font-medium">Shipping</span>
              </div>
              <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {step > 2 ? <Icon name="CheckIcon" size={20} /> : '2'}
                </div>
                <span className="hidden sm:block font-medium">Review & Pay</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                    <Icon name="MapPinIcon" size={24} className="text-accent" />
                    Shipping Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                        className={`w-full h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background ${errors.fullName ? 'border-red-500' : 'border-input'}`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className={`w-full h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background ${errors.phone ? 'border-red-500' : 'border-input'}`}
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Email *</label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className={`w-full h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background ${errors.email ? 'border-red-500' : 'border-input'}`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Address *</label>
                      <textarea
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        rows={2}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none ${errors.address ? 'border-red-500' : 'border-input'}`}
                        placeholder="House/Flat No., Building, Street, Area"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">City *</label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className={`w-full h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background ${errors.city ? 'border-red-500' : 'border-input'}`}
                        placeholder="City"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">State *</label>
                      <input
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                        className={`w-full h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background ${errors.state ? 'border-red-500' : 'border-input'}`}
                        placeholder="State"
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Pincode *</label>
                      <input
                        type="text"
                        value={shippingInfo.pincode}
                        onChange={(e) => setShippingInfo({...shippingInfo, pincode: e.target.value})}
                        className={`w-full h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background ${errors.pincode ? 'border-red-500' : 'border-input'}`}
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                    </div>
                  </div>

                  <button
                    onClick={handleContinue}
                    className="w-full mt-6 h-12 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Review
                    <Icon name="ArrowRightIcon" size={20} />
                  </button>
                </div>
              )}

              {/* Step 2: Review & Payment */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Shipping Address Review */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <Icon name="MapPinIcon" size={20} className="text-accent" />
                        Shipping Address
                      </h2>
                      <button
                        onClick={() => setStep(1)}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm text-text-secondary">
                      <p className="font-medium text-text-primary">{shippingInfo.fullName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
                      <p>Phone: {shippingInfo.phone}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Icon name="ShoppingBagIcon" size={20} className="text-accent" />
                      Order Items ({cartCount})
                    </h2>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                          <img
                            src={item.thumbnail || item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-text-primary line-clamp-2">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-text-primary">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Icon name="CreditCardIcon" size={20} className="text-accent" />
                      Payment Method
                    </h2>
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
                          <Icon name="BanknotesIcon" size={24} className="text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-amber-800 dark:text-amber-400">Cash on Delivery</p>
                          <p className="text-sm text-amber-600 dark:text-amber-500">Pay when your order is delivered</p>
                        </div>
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <Icon name="CheckIcon" size={16} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="h-12 px-6 bg-muted text-text-primary rounded-xl font-semibold hover:bg-muted/80 transition-colors flex items-center gap-2"
                    >
                      <Icon name="ArrowLeftIcon" size={20} />
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <Icon name="CheckCircleIcon" size={20} />
                          Place Order - ₹{total.toLocaleString('en-IN')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-bold text-text-primary mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({cartCount} items)</span>
                    <span className="text-text-primary font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-text-primary font-medium'}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">Free shipping on orders above ₹999</p>
                  )}
                </div>

                <div className="border-t border-border my-4 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-text-primary">Total</span>
                    <span className="text-text-primary">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Including all taxes</p>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-border space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Icon name="ShieldCheckIcon" size={18} className="text-green-600" />
                    <span className="text-muted-foreground">Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Icon name="TruckIcon" size={18} className="text-blue-600" />
                    <span className="text-muted-foreground">Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Icon name="ArrowPathIcon" size={18} className="text-purple-600" />
                    <span className="text-muted-foreground">Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
