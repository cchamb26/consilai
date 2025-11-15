import './globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../lib/AuthContext';

export const metadata = {
  title: 'ConsilAI - Smart Teacher Assistant',
  description: 'AI-powered student support and seating chart simulation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-slate-950">
            {children}
          </main>
          <footer className="bg-slate-950 border-t border-white/10 text-slate-500 py-8 mt-12">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <p className="text-sm tracking-wide uppercase">© 2025 ConsilAI</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

