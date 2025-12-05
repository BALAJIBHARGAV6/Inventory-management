'use client';

import { useEffect, useRef } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
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

  // Project team members
  const teamMembers = [
    {
      name: 'Pragathi',
      role: 'Developer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      bio: 'Full Stack Development',
    },
    {
      name: 'Meghana',
      role: 'Developer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      bio: 'Frontend Development',
    },
    {
      name: 'Sravani',
      role: 'Developer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
      bio: 'Backend Development',
    },
    {
      name: 'Prem Sai',
      role: 'Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      bio: 'Database & API Development',
    },
    {
      name: 'Ajay',
      role: 'Developer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      bio: 'UI/UX Design',
    },
  ];

  const stats = [
    { value: 'Next.js', label: 'Frontend Framework', icon: 'CodeBracketIcon' },
    { value: 'Supabase', label: 'Database & Auth', icon: 'CircleStackIcon' },
    { value: 'Fastify', label: 'Backend API', icon: 'ServerIcon' },
    { value: 'AI/ML', label: 'Demand Forecasting', icon: 'SparklesIcon' },
  ];

  const features = [
    { year: 'Feature 1', title: 'Inventory Management', desc: 'Real-time stock tracking and automated reorder alerts' },
    { year: 'Feature 2', title: 'AI Demand Forecasting', desc: 'Machine learning powered sales predictions' },
    { year: 'Feature 3', title: 'E-commerce Platform', desc: 'Full-featured online shopping experience' },
    { year: 'Feature 4', title: 'Analytics Dashboard', desc: 'Comprehensive sales and inventory analytics' },
    { year: 'Feature 5', title: 'User Authentication', desc: 'Secure login with role-based access control' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      <main className="pt-16">
        {/* Hero Section with Animated Background */}
        <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden px-4">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-5 md:left-10 w-40 md:w-72 h-40 md:h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-20 right-5 md:right-10 w-48 md:w-96 h-48 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent/5 rounded-full blur-3xl" />
          </div>
          
          {/* Floating Geometric Shapes - Hidden on mobile */}
          <div ref={heroRef} className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out hidden md:block">
            <div className="absolute top-1/4 left-1/4 w-20 h-20 border border-accent/30 rounded-lg rotate-45 animate-float" />
            <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-primary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-accent/10 rounded-lg animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-8 animate-slide-down">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm font-medium text-text-secondary">B.Tech Final Year Project 2025-26</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 md:mb-8 animate-slide-up">
                InventoryPredictor
                <span className="block mt-2 bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
                  Final Year Project
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-2xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-8 md:mb-12 animate-slide-up px-2" style={{ animationDelay: '0.2s' }}>
                An AI-powered inventory management system with demand forecasting and e-commerce capabilities.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <a href="/product-listing" className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:scale-105 transition-smooth flex items-center justify-center gap-2 text-sm sm:text-base">
                  Explore Products
                  <Icon name="ArrowRightIcon" size={18} />
                </a>
                <a href="#story" className="px-6 sm:px-8 py-3 sm:py-4 glass-card rounded-xl font-semibold hover:scale-105 transition-smooth flex items-center justify-center gap-2 text-sm sm:text-base">
                  Our Story
                  <Icon name="PlayIcon" size={18} />
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
        <section className="py-12 md:py-20 relative">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="glass-card rounded-xl md:rounded-2xl p-4 md:p-8 text-center hover:-translate-y-2 transition-smooth group"
                >
                  <div className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 bg-accent/10 rounded-lg md:rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-smooth">
                    <Icon name={stat.icon} size={20} className="text-accent md:hidden" />
                    <Icon name={stat.icon} size={28} className="text-accent hidden md:block" />
                  </div>
                  <div className="text-lg md:text-4xl lg:text-5xl font-bold text-text-primary mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-text-secondary font-medium">{stat.label}</div>
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
                  Project Overview
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">
                  About This Project
                </h2>
                <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
                  <p>
                    <strong>InventoryPredictor</strong> is a comprehensive inventory management system 
                    developed as a B.Tech Final Year Project. It combines modern web technologies 
                    with AI-powered demand forecasting.
                  </p>
                  <p>
                    The system helps businesses manage their inventory efficiently by predicting 
                    future demand patterns, automating reorder processes, and providing real-time 
                    analytics for better decision making.
                  </p>
                  <p>
                    Built with Next.js 14, Supabase, and Fastify, this project demonstrates 
                    full-stack development skills including authentication, database management, 
                    API development, and responsive UI design.
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

        {/* Features Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                Key Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                Project Features
              </h2>
            </div>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />
              {features.map((feature, index) => (
                <div key={index} className={`relative flex items-center gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-smooth">
                      <div className="text-accent font-bold text-lg mb-2">{feature.year}</div>
                      <h3 className="text-xl font-semibold text-text-primary mb-2">{feature.title}</h3>
                      <p className="text-text-secondary">{feature.desc}</p>
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

        {/* Tech Stack Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                Technologies Used
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                Tech Stack
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'CodeBracketIcon', title: 'Frontend', desc: 'Next.js 14, React, TailwindCSS, Framer Motion for a modern, responsive UI.', color: 'from-blue-500 to-cyan-500' },
                { icon: 'CircleStackIcon', title: 'Backend & Database', desc: 'Fastify API server with Supabase PostgreSQL database and authentication.', color: 'from-emerald-500 to-teal-500' },
                { icon: 'SparklesIcon', title: 'AI/ML', desc: 'Machine learning models for demand forecasting and inventory optimization.', color: 'from-purple-500 to-pink-500' },
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
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-16">
              <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-accent/10 text-accent rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
                Our Team
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-text-primary">
                Project Developers
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="glass-card rounded-xl md:rounded-3xl p-3 md:p-6 text-center hover:-translate-y-2 transition-smooth group"
                >
                  <div className="relative w-16 h-16 md:w-32 md:h-32 mx-auto mb-3 md:mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/50 rounded-full opacity-0 group-hover:opacity-100 transition-smooth blur-xl" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 md:border-4 border-background shadow-lg">
                      <AppImage
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                    </div>
                  </div>
                  <h3 className="text-sm md:text-xl font-bold text-text-primary mb-0.5 md:mb-1">{member.name}</h3>
                  <p className="text-accent font-medium text-xs md:text-base mb-1 md:mb-3">{member.role}</p>
                  <p className="text-xs md:text-sm text-text-secondary hidden md:block">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/10 to-primary/20" />
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-background/10 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 md:mb-6">
              Explore the
              <span className="block text-accent">InventoryPredictor</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-900 dark:text-white mb-8 md:mb-10 max-w-2xl mx-auto px-4">
              Experience the full features of this inventory management system with AI-powered forecasting.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/product-listing"
                className="px-6 sm:px-10 py-3 sm:py-5 bg-primary text-primary-foreground rounded-xl font-bold text-base sm:text-lg hover:scale-105 transition-smooth flex items-center gap-2 sm:gap-3 shadow-xl"
              >
                View Products
                <Icon name="ArrowRightIcon" size={20} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
