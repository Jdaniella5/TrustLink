import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-black py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Join Us Today!
        </h2>

        {/* Description Paragraph 1 */}
        <p className="text-gray-300 text-lg leading-relaxed mb-4">
          Join TrustLink today and experience a future where nothing is assumed—everything is verified. Our blockchain-powered platform ensures the authenticity of identities, services, and events, protecting you from fraud and securing what matters most.
        </p>

        {/* Description Paragraph 2 */}
        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          Take the next step toward a more transparent, secure, and connected world.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/register')}
          className="px-8 py-3.5 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors font-semibold inline-flex items-center shadow-lg text-lg"
        >
          Request Demo
          <span className="ml-2">→</span>
        </button>

      </div>
    </section>
  );
};

export default CTASection;