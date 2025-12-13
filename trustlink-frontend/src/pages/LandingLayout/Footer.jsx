import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, ArrowUp, MessageCircle, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 relative border-t border-yellow-300/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-20">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              {/* Logo placeholder - replace with your actual logo */}
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
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              TrustLink® is The next generation of ID verification. Verify identity, not documents. Reimagining digital onboarding with fraud-proof, biometric, and blockchain-based identity confirmation.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3 mb-6">
              <a href="#facebook" className="bg-yellow-300/10 border border-yellow-300/30 p-2.5 rounded hover:bg-yellow-300 hover:text-black transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#twitter" className="bg-yellow-300/10 border border-yellow-300/30 p-2.5 rounded hover:bg-yellow-300 hover:text-black transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#linkedin" className="bg-yellow-300/10 border border-yellow-300/30 p-2.5 rounded hover:bg-yellow-300 hover:text-black transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#instagram" className="bg-yellow-300/10 border border-yellow-300/30 p-2.5 rounded hover:bg-yellow-300 hover:text-black transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-300">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><a href="#home" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Contact Us</a></li>
              <li><a href="#blogs" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Blogs</a></li>
            </ul>
          </div>

          {/* Products- Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-300">Products</h3>
            <ul className="space-y-2.5">
              <li><a href="#trustlink-id" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">TrustLink ID</a></li>
              <li><a href="#trustlink-org" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">TrustLink Org ID</a></li>
              <li><a href="#trustlink-kyc" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">TrustLink KYC</a></li>
              <li><a href="#trustlink-kyb" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">TrustLink KYB</a></li>
              <li><a href="#trustlink-x" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">TrustLink X</a></li>
              <li><a href="#trustlink-pay" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">TrustLink Pay</a></li>
              <li><a href="#business-rules" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Business Rules Engine</a></li>
              <li><a href="#being-id" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Being ID</a></li>
            </ul>
          </div>

          {/* Applications - Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-300">Applications</h3>
            <ul className="space-y-2.5">
              <li><a href="#touch-audit" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Touch Audit</a></li>
              <li><a href="#token-grading" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Token Grading System</a></li>
              <li><a href="#validated-tokens" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Validated Data Tokens</a></li>
              <li><a href="#factvera" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Factvera</a></li>
              <li><a href="#trustlink-check" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">TrustLink Check</a></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-300">Legal</h3>
            <ul className="space-y-2.5 mb-8">
              <li><a href="#privacy" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#biometric" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Biometric Policy</a></li>
              <li><a href="#terms" className="text-gray-400 hover:text-yellow-300 transition-colors text-sm">Terms & Conditions</a></li>
            </ul>

            <h3 className="text-lg font-semibold mb-4 text-yellow-300">Contact Us</h3>
            <p className="text-gray-400 text-sm flex items-center">
              <Phone size={16} className="mr-2 text-yellow-300">📞</Phone>
              +1 (307) 313-6134
            </p>
            <p className="text-gray-400 text-sm flex items-center pt-2">
              <Mail size={16}  className="mr-2 text-yellow-300"></Mail>
              support@trustlink.com
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-yellow-300/20 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 by TrustLink Incorporated
          </p>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-3 z-50">
        {/* Scroll to top button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-yellow-300 text-black p-3 rounded-full shadow-lg hover:bg-yellow-400 transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
        
        {/* Chat/Message button */}
        <button 
          className="bg-gray-800 border border-yellow-300/30 text-yellow-300 p-3 rounded-full shadow-lg hover:bg-yellow-300 hover:text-black transition-colors"
          aria-label="Chat with us"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;