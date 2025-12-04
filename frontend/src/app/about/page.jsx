'use client';

import { useEffect, useRef } from 'react';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export default function AboutPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      heroRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const teamMembers = [
    {
      name: 'Rahul Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      bio: 'Visionary leader with 15+ years in e-commerce',
    },
    {
      name: 'Priya Patel',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      bio: 'Award-winning designer passionate about UX',
    },
    {
      name: 'Amit Kumar',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      bio: 'Tech innovator building scalable solutions',
    },
    {
      name: 'Sneha Reddy',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      bio: 'Operations expert ensuring seamless delivery',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Happy Customers', icon: 'UserGroupIcon' },
    { value: '10K+', label: 'Products', icon: 'CubeIcon' },
    { value: '99%', label: 'Satisfaction', icon: 'StarIcon' },
    { value: '24/7', label: 'Support', icon: 'ChatBubbleLeftRightIcon' },
  ];

  const milestones = [
    { year: '2020', title: 'Founded', desc: 'Started with a vision to transform e-commerce' },
    { year: '2021', title: '10K Users', desc: 'Reached our first major milestone' },
    { year: '2022', title: 'Expansion', desc: 'Launched in 10+ cities across India' },
    { year: '2023', title: 'Award', desc: 'Best E-commerce Platform Award' },
    { year: '2024', title: '50K Users', desc: 'Growing stronger every day' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      <main className="pt-16">
        {/* Hero Section with Animated Background */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
          </div>
          
          {/* Floating Geometric Shapes */}
          <div ref={heroRef} className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out">
            <div className="absolute top-1/4 left-1/4 w-20 h-20 border border-accent/30 rounded-lg rotate-45 animate-float" />
            <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-primary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-accent/10 rounded-lg animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-8 animate-slide-down">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm font-medium text-text-secondary">Trusted by 50,000+ customers</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-8 animate-slide-up">
                We're Building the
                <span className="block mt-2 bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                  Future of Shopping
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Premium products, exceptional service, and an unparalleled customer experience.
              </p>

              <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <a href="/product-listing" className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:scale-105 transition-smooth flex items-center gap-2">
                  Explore Products
                  <Icon name="ArrowRightIcon" size={20} />
                </a>
                <a href="#story" className="px-8 py-4 glass-card rounded-xl font-semibold hover:scale-105 transition-smooth flex items-center gap-2">
                  Our Story
                  <Icon name="PlayIcon" size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <Icon name="ChevronDownIcon" size={32} className="text-text-secondary" />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="glass-card rounded-2xl p-8 text-center hover:-translate-y-2 transition-smooth group"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-smooth">
                    <Icon name={stat.icon} size={28} className="text-accent" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-secondary font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section id="story" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
                  Our Journey
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">
                  From Vision to Reality
                </h2>
                <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
                  <p>
                    Founded in 2020, InventoryPredictor began with a bold vision: 
                    to create an online shopping experience that truly puts customers first.
                  </p>
                  <p>
                    What started as a small startup has blossomed into a trusted platform 
                    serving over 50,000 customers across India. We believe in quality 
                    over quantity—every product is carefully curated.
                  </p>
                  <p>
                    Our commitment extends beyond products. From lightning-fast delivery 
                    to 24/7 customer support, we're here to make every shopping experience exceptional.
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2 relative">
                <div className="relative z-10">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden glass-card shadow-xl">
                    <AppImage
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                      alt="Our team working together"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                        <Icon name="TrophyIcon" size={24} className="text-accent-foreground" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-text-primary">4.9★</div>
                        <div className="text-sm text-text-secondary">Customer Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-8 -right-8 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                Milestones
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                Our Journey So Far
              </h2>
            </div>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-smooth">
                      <div className="text-accent font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-text-primary mb-2">{milestone.title}</h3>
                      <p className="text-text-secondary">{milestone.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 bg-accent rounded-full items-center justify-center z-10 flex-shrink-0">
                    <Icon name="CheckIcon" size={24} className="text-accent-foreground" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                What Drives Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                Our Core Values
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'HeartIcon', title: 'Customer First', desc: 'Every decision starts with our customers. Their satisfaction is our success.', color: 'from-pink-500 to-rose-500' },
                { icon: 'SparklesIcon', title: 'Quality Excellence', desc: 'We never compromise. Every product meets our rigorous quality standards.', color: 'from-amber-500 to-orange-500' },
                { icon: 'ShieldCheckIcon', title: 'Trust & Transparency', desc: 'Building lasting relationships through honest communication and integrity.', color: 'from-emerald-500 to-teal-500' },
              ].map((value, index) => (
                <div 
                  key={index}
                  className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-smooth group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-smooth`} />
                  <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center`}>
                    <Icon name={value.icon} size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-4">{value.title}</h3>
                  <p className="text-text-secondary text-lg leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                The People
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                Meet Our Team
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="glass-card rounded-3xl p-6 text-center hover:-translate-y-2 transition-smooth group"
                >
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/50 rounded-full opacity-0 group-hover:opacity-100 transition-smooth blur-xl" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-lg">
                      <AppImage
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">{member.name}</h3>
                  <p className="text-accent font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-text-secondary">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-background/10 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Ready to Experience
              <span className="block">Premium Shopping?</span>
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Join 50,000+ happy customers and discover our curated collection of premium products.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/product-listing"
                className="px-10 py-5 bg-background text-foreground rounded-xl font-bold text-lg hover:scale-105 transition-smooth flex items-center gap-3 shadow-xl"
              >
                Start Shopping
                <Icon name="ArrowRightIcon" size={24} />
              </a>
              <a
                href="/shopping-cart"
                className="px-10 py-5 bg-transparent border-2 border-primary-foreground text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary-foreground/10 transition-smooth flex items-center gap-3"
              >
                View Cart
                <Icon name="ShoppingCartIcon" size={24} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
