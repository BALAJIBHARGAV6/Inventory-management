import '../styles/index.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'InventoryPredictor | Premium E-Commerce',
  description: 'Your one-stop destination for premium quality products',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html { background-color: rgb(10, 10, 10); }
              html.dark { background-color: rgb(10, 10, 10); }
              html:not(.dark) { background-color: white; }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-neutral-900 font-body antialiased">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <div className="transition-opacity duration-300">
                {children}
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
