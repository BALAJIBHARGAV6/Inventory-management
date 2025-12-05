import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export const metadata = {
  title: 'Terms of Service | InventoryPredictor',
  description: 'Read our terms and conditions for using InventoryPredictor services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Agreement to Terms</h2>
                <p className="text-muted-foreground mb-4">
                  By accessing and using InventoryPredictor's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Use License</h2>
                <p className="text-muted-foreground mb-4">
                  Permission is granted to temporarily download one copy of the materials on InventoryPredictor's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Account Terms</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>You must be 18 years or older to use this service</li>
                  <li>You must provide accurate and complete registration information</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Products and Services</h2>
                <p className="text-muted-foreground mb-4">
                  All products and services are subject to availability. We reserve the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Modify or discontinue products without notice</li>
                  <li>Limit quantities of products available for purchase</li>
                  <li>Refuse service to anyone for any reason</li>
                  <li>Update product information and pricing</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Pricing and Payment</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>All prices are listed in Indian Rupees (INR)</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Payment is required at the time of order placement</li>
                  <li>We accept various payment methods including Cash on Delivery</li>
                  <li>Additional charges may apply for shipping and handling</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Shipping and Delivery</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>Risk of loss transfers to you upon delivery</li>
                  <li>You must provide accurate shipping information</li>
                  <li>Additional charges may apply for expedited shipping</li>
                  <li>We are not responsible for delays caused by shipping carriers</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Returns and Refunds</h2>
                <p className="text-muted-foreground mb-4">
                  We want you to be satisfied with your purchase. Our return policy includes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>7-day return window from delivery date</li>
                  <li>Items must be in original condition and packaging</li>
                  <li>Return shipping costs may apply</li>
                  <li>Refunds processed within 5-7 business days</li>
                  <li>Some items may not be eligible for return</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Prohibited Uses</h2>
                <p className="text-muted-foreground mb-4">
                  You may not use our service:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Disclaimer</h2>
                <p className="text-muted-foreground mb-4">
                  The information on this website is provided on an 'as is' basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms related to our website and the use of this website.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Limitations</h2>
                <p className="text-muted-foreground mb-4">
                  In no event shall InventoryPredictor or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on InventoryPredictor's website.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Governing Law</h2>
                <p className="text-muted-foreground mb-4">
                  These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-muted/30 rounded-xl p-6">
                  <p className="text-text-primary font-semibold mb-2">InventoryPredictor</p>
                  <p className="text-muted-foreground">Email: inventorypredictor@gmail.com</p>
                  <p className="text-muted-foreground">Phone: +91 98765 43210</p>
                  <p className="text-muted-foreground">Address: Vijayawada, Andhra Pradesh, India</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
