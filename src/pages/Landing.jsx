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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-display font-bold text-gray-900 mb-6">
            Agri Export Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connecting farmers, importers, and buyers in a seamless agricultural export platform.
            Browse quality crops, place orders, and track shipments all in one place.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/storefront" className="btn btn-primary btn-lg px-8 py-3 text-lg">
              Browse Crops
            </Link>
            <Link to="/register" className="btn btn-secondary px-8 py-3 text-lg">
              Register as Buyer
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold mb-2">Quality Crops</h3>
            <p className="text-gray-600">
              Access a wide variety of quality crops from verified farmers and trusted import sources.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Easy Ordering</h3>
            <p className="text-gray-600">
              Place orders online, get instant approval, and track your shipments in real-time.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Reliable shipping with tracking numbers and delivery confirmation for peace of mind.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2026 AEMS - Agri Export Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
