'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Icon from '@/components/ui/AppIcon';

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqData = [
    {
      category: "Orders & Payment",
      questions: [
        {
          question: "How do I place an order?",
          answer: "Simply browse our products, add items to your cart, and proceed to checkout. You can pay using various methods including Cash on Delivery."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept Cash on Delivery (COD), credit/debit cards, UPI, net banking, and digital wallets."
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "You can modify or cancel your order within 1 hour of placing it. After that, please contact our customer support for assistance."
        },
        {
          question: "How do I track my order?",
          answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order in the 'My Orders' section of your account."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          question: "How long does delivery take?",
          answer: "Standard delivery takes 5-7 business days. Express delivery (2-3 days) and same-day delivery are also available in select areas."
        },
        {
          question: "Do you offer free shipping?",
          answer: "Yes! We offer free standard shipping on all orders above ₹999. For orders below ₹999, a shipping charge of ₹99 applies."
        },
        {
          question: "Do you deliver to my area?",
          answer: "We deliver across India to most locations. Enter your pincode at checkout to check if delivery is available in your area."
        },
        {
          question: "What if I'm not available for delivery?",
          answer: "Our delivery partner will attempt delivery 3 times. If unsuccessful, the package will be returned to our warehouse, and you'll need to reschedule delivery."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 7-day return policy from the date of delivery. Items must be in original condition with tags intact."
        },
        {
          question: "How do I return an item?",
          answer: "Go to 'My Orders', select the item you want to return, and schedule a free pickup. Our courier will collect the item from your location."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 5-7 business days after we receive and inspect the returned item."
        },
        {
          question: "Can I exchange an item instead of returning it?",
          answer: "Currently, we only offer returns and refunds. You can place a new order for the item you want after returning the original item."
        }
      ]
    },
    {
      category: "Account & Support",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click on the 'Sign Up' button in the top right corner and fill in your details. You can also create an account during checkout."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click on 'Forgot Password' on the login page and enter your email. We'll send you a link to reset your password."
        },
        {
          question: "How do I update my profile information?",
          answer: "Go to 'My Account' and click on 'Edit Profile' to update your personal information, address, and contact details."
        },
        {
          question: "How can I contact customer support?",
          answer: "You can reach us via email at inventorypredictor@gmail.com, call us at +91 98765 43210, or use the contact form on our website."
        }
      ]
    },
    {
      category: "Products & Quality",
      questions: [
        {
          question: "Are your products genuine?",
          answer: "Yes, all our products are 100% genuine and sourced directly from authorized dealers and manufacturers."
        },
        {
          question: "Do you offer warranty on products?",
          answer: "Yes, all products come with manufacturer warranty. Warranty terms vary by product and are mentioned on the product page."
        },
        {
          question: "Can I see product reviews?",
          answer: "Yes, you can find customer reviews and ratings on each product page to help you make informed decisions."
        },
        {
          question: "What if I receive a damaged product?",
          answer: "If you receive a damaged product, please contact us immediately with photos. We'll arrange for a replacement or full refund."
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const faqId = `${categoryIndex}-${questionIndex}`;
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our products, shipping, returns, and more.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{categoryIndex + 1}</span>
                  </div>
                  {category.category}
                </h2>
                
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const faqId = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openFAQ === faqId;
                    
                    return (
                      <div
                        key={questionIndex}
                        className="border border-border rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                        >
                          <span className="font-semibold text-text-primary pr-4">
                            {faq.question}
                          </span>
                          <Icon
                            name="ChevronDownIcon"
                            size={20}
                            className={`text-muted-foreground transition-transform flex-shrink-0 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <div className="pt-2 border-t border-border">
                              <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? Our customer support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Icon name="ChatBubbleLeftRightIcon" size={20} />
                  Contact Support
                </a>
                <a
                  href="mailto:inventorypredictor@gmail.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted text-text-primary rounded-xl font-semibold hover:bg-muted/80 transition-colors"
                >
                  <Icon name="EnvelopeIcon" size={20} />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
