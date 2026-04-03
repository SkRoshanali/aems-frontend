import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-display font-bold text-primary">AEMS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/storefront" className="text-gray-700 hover:text-primary">
                Storefront
              </Link>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-ghost">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Full screen video hero section */}
      <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
        {/* Background video */}
        <video
          src="/aemsvideo.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center">
          <h1 className="text-5xl font-display font-bold mb-4 drop-shadow-lg">
            Agri Export Management System
          </h1>
          <p className="text-xl mb-8 max-w-3xl text-gray-200 drop-shadow">
            Connecting farmers, importers, and buyers in a seamless agricultural export platform.
            Browse quality crops, place orders, and track shipments all in one place.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/storefront" className="btn btn-primary btn-lg px-8 py-3 text-lg">
              Browse Crops
            </Link>
            <Link to="/register" className="bg-white text-primary font-semibold px-8 py-3 text-lg rounded-lg hover:bg-gray-100 transition">
              Register as Buyer
            </Link>
          </div>

          {/* Feature cards at bottom of video */}
          <div className="absolute bottom-10 left-0 right-0 px-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-5 text-white text-center">
                <div className="text-3xl mb-2">🌾</div>
                <h3 className="text-lg font-semibold mb-1">Quality Crops</h3>
                <p className="text-sm text-gray-200">
                  Access a wide variety of quality crops from verified farmers and trusted import sources.
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-5 text-white text-center">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="text-lg font-semibold mb-1">Easy Ordering</h3>
                <p className="text-sm text-gray-200">
                  Place orders online, get instant approval, and track your shipments in real-time.
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-5 text-white text-center">
                <div className="text-3xl mb-2">🚚</div>
                <h3 className="text-lg font-semibold mb-1">Fast Delivery</h3>
                <p className="text-sm text-gray-200">
                  Reliable shipping with tracking numbers and delivery confirmation for peace of mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-600 font-medium">Delivery Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-gray-600 font-medium">Satisfied Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-gray-600 font-medium">Verified Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600 font-medium">Crop Varieties</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-bold text-primary mb-1">AEMS</h2>
              <p className="text-gray-400 text-sm">Agri Export Management System</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <span className="text-gray-400 text-sm font-medium">Follow us on</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              © 2026 AEMS - Agri Export Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
