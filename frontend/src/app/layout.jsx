import '../styles/index.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export const metadata = {
  title: 'InventoryPredictor | Premium E-Commerce',
  description: 'Your one-stop destination for premium quality products',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark" data-theme="dark">
      <head>
        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%230a0a0a'/><text x='50' y='68' font-size='50' text-anchor='middle' fill='white'>IP</text></svg>" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical CSS - Prevent white flash */
              html {
                background: #0a0a0a !important;
                color-scheme: dark !important;
              }
              html.dark, html[data-theme="dark"] {
                background: #0a0a0a !important;
                --color-background: #0a0a0a;
              }
              body {
                background: #0a0a0a !important;
                margin: 0;
                min-height: 100vh;
              }
              /* Disable transitions during load */
              html:not(.loaded) * {
                transition: none !important;
                animation: none !important;
              }
              /* Loading state */
              .page-loading {
                opacity: 0;
              }
              html.loaded .page-loading {
                opacity: 1;
                transition: opacity 0.2s ease;
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var d = document.documentElement;
                var b = document.body;
                
                // Set dark theme immediately
                d.style.background = '#0a0a0a';
                d.classList.add('dark');
                d.setAttribute('data-theme', 'dark');
                
                // Apply to body when ready
                if (b) b.style.background = '#0a0a0a';
                
                // Check saved preference
                try {
                  var t = localStorage.getItem('theme');
                  if (t === 'light') {
                    d.classList.remove('dark');
                    d.classList.add('light');
                    d.setAttribute('data-theme', 'light');
                    d.style.background = '#ffffff';
                    if (b) b.style.background = '#ffffff';
                  }
                } catch(e) {}
                
                // Mark loaded after DOM ready
                if (document.readyState === 'complete') {
                  d.classList.add('loaded');
                } else {
                  window.addEventListener('DOMContentLoaded', function() {
                    requestAnimationFrame(function() {
                      d.classList.add('loaded');
                    });
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-body antialiased page-loading">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <main className="flex flex-col min-h-screen">
                {children}
              </main>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
