'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Icon from '@/components/ui/AppIcon';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question or need support? We're here to help. Get in touch with our team.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="EnvelopeIcon" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Email</h3>
                    <p className="text-muted-foreground">inventorypredictor@gmail.com</p>
                    <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="PhoneIcon" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Phone</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri 9AM-6PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="MapPinIcon" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      Vijayawada, Andhra Pradesh<br />
                      India
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-muted/30 rounded-2xl p-6">
                <h3 className="font-semibold text-text-primary mb-4">Quick Help</h3>
                <div className="space-y-3">
                  <a href="/faq" className="flex items-center gap-3 text-muted-foreground hover:text-text-primary transition-colors">
                    <Icon name="QuestionMarkCircleIcon" size={18} />
                    <span>Frequently Asked Questions</span>
                  </a>
                  <a href="/shipping-returns" className="flex items-center gap-3 text-muted-foreground hover:text-text-primary transition-colors">
                    <Icon name="TruckIcon" size={18} />
                    <span>Shipping & Returns</span>
                  </a>
                  <a href="/profile?tab=orders" className="flex items-center gap-3 text-muted-foreground hover:text-text-primary transition-colors">
                    <Icon name="ClipboardDocumentListIcon" size={18} />
                    <span>Track Your Order</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Send us a Message</h2>
              
              {submitMessage && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Icon name="CheckCircleIcon" size={20} />
                    <p className="text-sm">{submitMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Support</option>
                    <option value="product">Product Inquiry</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icon name="PaperAirplaneIcon" size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
