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

      <footer className="bg-gray-50">
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
