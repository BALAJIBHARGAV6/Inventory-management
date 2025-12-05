import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export const metadata = {
  title: 'Privacy Policy | InventoryPredictor',
  description: 'Learn how we protect your privacy and handle your data at InventoryPredictor.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  At InventoryPredictor, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-text-primary mb-3">Personal Information</h3>
                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                  <li>Name and contact information (email, phone number, address)</li>
                  <li>Account credentials and profile information</li>
                  <li>Payment and billing information</li>
                  <li>Order history and preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-text-primary mb-3">Usage Information</h3>
                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Website usage patterns and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Improve our website and services</li>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>With service providers who assist in our operations</li>
                  <li>When required by law or legal process</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access and review your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Cookies and Tracking</h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Data Retention</h2>
                <p className="text-muted-foreground mb-4">
                  We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Children's Privacy</h2>
                <p className="text-muted-foreground mb-4">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
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
