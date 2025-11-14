import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'ConsilAI - Smart Teacher Assistant',
  description: 'AI-powered student support and seating chart simulation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm">© 2024 ConsilAI. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

