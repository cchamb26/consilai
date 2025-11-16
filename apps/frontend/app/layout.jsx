import './globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../lib/AuthContext';
import { ThemeProvider } from '../lib/ThemeContext';

export const metadata = {
  title: 'ConsilAI - Smart Teacher Assistant',
  description: 'AI-powered student support and seating chart simulation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen bg-background-light dark:bg-background-dark">
              {children}
            </main>
            <footer className="bg-background-light dark:bg-background-dark border-t border-border dark:border-slate-800 text-text-secondary-light dark:text-text-secondary-dark py-8 mt-12 transition-colors">
              <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="text-sm tracking-wide uppercase">© 2025 ConsilAI</p>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

