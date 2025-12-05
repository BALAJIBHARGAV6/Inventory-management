import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Icon from '@/components/ui/AppIcon';

export const metadata = {
  title: 'Shipping & Returns | InventoryPredictor',
  description: 'Learn about our shipping policies, delivery options, and return process.',
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Shipping & Returns
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our shipping policies, delivery options, and hassle-free returns.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Shipping Information */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Icon name="TruckIcon" size={24} className="text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-text-primary">Shipping</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">Delivery Options</h3>
                  <div className="space-y-4">
                    <div className="border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-text-primary">Standard Delivery</h4>
                        <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">FREE on orders ₹999+</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">5-7 business days</p>
                      <p className="text-muted-foreground text-sm">₹99 for orders below ₹999</p>
                    </div>
                    
                    <div className="border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-text-primary">Express Delivery</h4>
                        <span className="text-sm text-muted-foreground">₹199</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">2-3 business days</p>
                      <p className="text-muted-foreground text-sm">Available in major cities</p>
                    </div>

                    <div className="border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-text-primary">Same Day Delivery</h4>
                        <span className="text-sm text-muted-foreground">₹299</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">Within 24 hours</p>
                      <p className="text-muted-foreground text-sm">Available in select areas</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">Shipping Information</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Icon name="CheckCircleIcon" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Orders are processed within 1-2 business days</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="CheckCircleIcon" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Free shipping on orders above ₹999</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="CheckCircleIcon" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Real-time tracking available for all orders</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="CheckCircleIcon" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Secure packaging to ensure product safety</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="CheckCircleIcon" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Cash on Delivery available</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">Delivery Areas</h3>
                  <p className="text-muted-foreground mb-4">
                    We currently deliver across India to the following locations:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>• All major cities</div>
                    <div>• Tier 2 cities</div>
                    <div>• Rural areas</div>
                    <div>• Remote locations</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Delivery charges may vary for remote locations.
                  </p>
                </div>
              </div>
            </div>

            {/* Returns Information */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Icon name="ArrowPathIcon" size={24} className="text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-text-primary">Returns</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">Return Policy</h3>
                  <div className="bg-muted/30 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-lg">7</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">7-Day Return Window</h4>
                        <p className="text-sm text-muted-foreground">From the date of delivery</p>
                      </div>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Icon name="CheckCircleIcon" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Items must be in original condition and packaging</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="CheckCircleIcon" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>All tags and labels must be intact</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="CheckCircleIcon" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Free return pickup available</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="CheckCircleIcon" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Refund processed within 5-7 business days</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">How to Return</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Initiate Return</h4>
                        <p className="text-sm text-muted-foreground">Go to your orders and click "Return Item"</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Schedule Pickup</h4>
                        <p className="text-sm text-muted-foreground">Choose a convenient time for pickup</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Pack the Item</h4>
                        <p className="text-sm text-muted-foreground">Use original packaging if available</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Handover to Courier</h4>
                        <p className="text-sm text-muted-foreground">Our courier will collect the item</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">Non-Returnable Items</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Icon name="XMarkIcon" size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Personalized or customized products</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="XMarkIcon" size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Perishable goods</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="XMarkIcon" size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Items damaged by misuse</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="XMarkIcon" size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Items without original packaging</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-text-primary mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-6">
              Have questions about shipping or returns? Our customer support team is here to help.
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
                href="tel:+919876543210"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted text-text-primary rounded-xl font-semibold hover:bg-muted/80 transition-colors"
              >
                <Icon name="PhoneIcon" size={20} />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
