import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-black text-white mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(255,215,0,0.4)]">
                  <svg className="w-8 h-8 fill-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                  </svg>
                </div>
                <div className="text-xl font-bold">
                  <span className="text-yellow-300">Trust</span>
                  <span className="text-white">Link</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#home" className="text-yellow-300 hover:text-yellow-400 transition-colors font-medium">
                Home
              </a>

              <div className="relative">
                <button
                  onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                  className="flex items-center text-white hover:text-yellow-300 transition-colors font-medium"
                >
                  TrustLink Platform
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isPlatformOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-black border border-yellow-300/30 rounded-md shadow-lg z-10">
                    <a href="#platform1" className="block px-4 py-2 hover:bg-yellow-300/10 hover:text-yellow-300 transition-colors">
                      Platform Option 1
                    </a>
                    <a href="#platform2" className="block px-4 py-2 hover:bg-yellow-300/10 hover:text-yellow-300 transition-colors">
                      Platform Option 2
                    </a>
                  </div>
                )}
              </div>

              <a href="#sdk" className="text-white hover:text-yellow-300 transition-colors font-medium">
                TrustLink SDK
              </a>
              <a href="#about" className="text-white hover:text-yellow-300 transition-colors font-medium">
                About Us
              </a>
              <a href="#blogs" className="text-white hover:text-yellow-300 transition-colors font-medium">
                Blogs
              </a>
              <a href="#contact" className="text-white hover:text-yellow-300 transition-colors font-medium">
                Contact Us
              </a>
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-2.5 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-colors font-semibold"
            >
              Demo
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-2.5 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-colors font-semibold"
            >
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-yellow-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-black transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a href="#home" className="block px-3 py-2 text-yellow-300 hover:bg-yellow-300/10 rounded-md transition-colors font-medium">
            Home
          </a>

          <button
            onClick={() => setIsPlatformOpen(!isPlatformOpen)}
            className="w-full text-left px-3 py-2 text-white hover:bg-yellow-300/10 hover:text-yellow-300 rounded-md transition-colors font-medium flex items-center justify-between"
          >
            TrustLink Platform
            <ChevronDown className="h-4 w-4" />
          </button>

          {isPlatformOpen && (
            <div className="pl-6 space-y-1">
              <a href="#platform1" className="block px-3 py-2 text-sm hover:bg-yellow-300/10 hover:text-yellow-300 rounded-md transition-colors">
                Platform Option 1
              </a>
              <a href="#platform2" className="block px-3 py-2 text-sm hover:bg-yellow-300/10 hover:text-yellow-300 rounded-md transition-colors">
                Platform Option 2
              </a>
            </div>
          )}

          <a href="#sdk" className="block px-3 py-2 text-white hover:bg-yellow-300/10 hover:text-yellow-300 rounded-md transition-colors font-medium">
            TrustLink SDK
          </a>
          <a href="#about" className="block px-3 py-2 text-white hover:bg-yellow-300/10 hover:text-yellow-300 rounded-md transition-colors font-medium">
            About Us
          </a>
          <a href="#blogs" className="block px-3 py-2 text-white hover:bg-yellow-300/10 hover:text-yellow-300 rounded-md transition-colors font-medium">
            Blogs
          </a>
          <a href="#contact" className="block px-3 py-2 text-white hover:bg-yellow-300/10 hover:text-yellow-300 rounded-md transition-colors font-medium">
            Contact Us
          </a>

          <div className="pt-4 space-y-2 px-3">
            <button
              onClick={() => navigate('/register')}
              className="w-full px-8 py-2.5 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-colors font-semibold"
            >
              Demo
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full px-8 py-2.5 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-colors font-semibold"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;