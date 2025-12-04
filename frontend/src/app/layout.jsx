import '../styles/index.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export const metadata = {
  title: 'InventoryPredictor | Premium E-Commerce',
  description: 'Your one-stop destination for premium quality products with AI-powered inventory management',
  keywords: 'ecommerce, shopping, electronics, fashion, AI inventory',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-screen bg-background font-body antialiased overflow-x-hidden">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <main className="fade-in">
                {children}
              </main>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
