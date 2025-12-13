import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsPlatformOpen(false); // Close dropdown when menu toggles
  };

  // Helper function to handle navigation and close menu
  const navigateAndClose = (path) => {
    toggleMenu();
    navigate(path);
  };

  return (
    <nav className="bg-black text-white mt-5 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Always visible */}
          <div className="flex items-center z-50">
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

          {/* Desktop Menu - (No changes for desktop) */}
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

          {/* Desktop Buttons - (No changes for desktop) */}
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

          {/* Mobile menu button - Always visible */}
          <div className="lg:hidden z-50">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-yellow-300 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/95 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleMenu}
      >
        {/* Menu Content - Added flex flex-col to enable dynamic layout */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-black shadow-2xl transform transition-transform duration-300 ease-in-out **flex flex-col** ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Spacer for navbar height - Adjusting for better visual fit */}
          <div className="h-16"></div> 
          
          {/* Menu Items - **Added flex-grow and overflow-y-auto** to make this the scrollable area */}
          <div className="px-8 py-6 space-y-3 **flex-grow overflow-y-auto**">
            <a 
              href="#home" 
              onClick={toggleMenu}
              className="block px-4 py-4 text-yellow-300 hover:bg-yellow-300/10 rounded-xl transition-colors font-medium text-lg"
            >
              Home
            </a>

            <div>
              <button
                onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                className="w-full text-left px-4 py-4 text-white hover:bg-yellow-300/10 hover:text-yellow-300 rounded-xl transition-colors font-medium flex items-center justify-between text-lg focus:outline-none"
              >
                TrustLink Platform
                <ChevronDown className={`h-5 w-5 transition-transform ${isPlatformOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPlatformOpen && (
                <div className="pl-6 mt-2 space-y-2">
                  <a 
                    href="#platform1" 
                    onClick={toggleMenu}
                    className="block px-4 py-3 text-gray-300 hover:bg-yellow-300/10 hover:text-yellow-300 rounded-lg transition-colors"
                  >
                    Platform Option 1
                  </a>
                  <a 
                    href="#platform2" 
                    onClick={toggleMenu}
                    className="block px-4 py-3 text-gray-300 hover:bg-yellow-300/10 hover:text-yellow-300 rounded-lg transition-colors"
                  >
                    Platform Option 2
                  </a>
                </div>
              )}
            </div>

            <a 
              href="#sdk" 
              onClick={toggleMenu}
              className="block px-4 py-4 text-white hover:bg-yellow-300/10 hover:text-yellow-300 rounded-xl transition-colors font-medium text-lg"
            >
              TrustLink SDK
            </a>
            <a 
              href="#about" 
              onClick={toggleMenu}
              className="block px-4 py-4 text-white hover:bg-yellow-300/10 hover:text-yellow-300 rounded-xl transition-colors font-medium text-lg"
            >
              About Us
            </a>
            <a 
              href="#blogs" 
              onClick={toggleMenu}
              className="block px-4 py-4 text-white hover:bg-yellow-300/10 hover:text-yellow-300 rounded-xl transition-colors font-medium text-lg"
            >
              Blogs
            </a>
            <a 
              href="#contact" 
              onClick={toggleMenu}
              className="block px-4 py-4 text-white hover:bg-yellow-300/10 hover:text-yellow-300 rounded-xl transition-colors font-medium text-lg"
            >
              Contact Us
            </a>

            {/* A small spacer for better look */}
            <div className="h-6"></div> 
          </div>

          {/* Mobile Buttons - **Moved outside the scrollable area** and added padding */}
          <div className="p-8 space-y-4 flex-shrink-0 border-t border-white/10">
            <button
              onClick={() => navigateAndClose('/register')}
              className="w-full px-8 py-4 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-colors font-semibold text-lg"
            >
              Demo
            </button>
            <button
              onClick={() => navigateAndClose('/login')}
              className="w-full px-8 py-4 bg-transparent border-2 border-yellow-300 text-yellow-300 rounded-full hover:bg-yellow-300 hover:text-black transition-colors font-semibold text-lg"
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