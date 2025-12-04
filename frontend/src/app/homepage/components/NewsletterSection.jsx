'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email?.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail('');
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary-foreground/10 rounded-full flex items-center justify-center backdrop-blur-sm animate-float">
            <Icon name="EnvelopeIcon" size={36} className="text-primary-foreground" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3 font-heading">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Get the latest updates on new products and upcoming sales
          </p>

          {isSubmitted ? (
            <div className="flex items-center justify-center gap-2 text-primary-foreground">
              <Icon name="CheckCircleIcon" size={24} />
              <span className="font-medium">Thank you for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 h-12 px-4 text-sm bg-primary-foreground text-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-6 text-sm font-semibold bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-micro disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <Icon name="ArrowRightIcon" size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
