import React from 'react';
import { Shield, Fingerprint, Lock, Smartphone } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="bg-black py-20 relative overflow-hidden">
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes draw-line {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        .planet-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
        .icon-float {
          animation: float-icon 3s ease-in-out infinite;
        }
        .icon-float-delay-1 {
          animation: float-icon 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .icon-float-delay-2 {
          animation: float-icon 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        .icon-float-delay-3 {
          animation: float-icon 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .animated-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-line 3s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            TrustLink® - Prioritizing <span className="text-yellow-400">Trust for Validity</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Animated Planet with Icons */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* SVG Lines connecting icons */}
            <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 500 500">
              {/* Lines connecting the icons - Extended to reach the icons */}
              <path
                d="M 250 250 L 100 100"
                stroke="rgb(250, 204, 21)"
                strokeWidth="2"
                fill="none"
                className="animated-line"
                style={{ animationDelay: '0s' }}
              />
              <path
                d="M 250 250 L 400 100"
                stroke="rgb(250, 204, 21)"
                strokeWidth="2"
                fill="none"
                className="animated-line"
                style={{ animationDelay: '0.3s' }}
              />
              <path
                d="M 250 250 L 100 400"
                stroke="rgb(250, 204, 21)"
                strokeWidth="2"
                fill="none"
                className="animated-line"
                style={{ animationDelay: '0.6s' }}
              />
              <path
                d="M 250 250 L 400 400"
                stroke="rgb(250, 204, 21)"
                strokeWidth="2"
                fill="none"
                className="animated-line"
                style={{ animationDelay: '0.9s' }}
              />
            </svg>

            {/* Central Planet - Replace with your actual image */}
            <div className="relative z-10 planet-breathe">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-2xl">
                {/*  IMAGE HERE */}
                <img 
                  src="images/planet.png" 
                  alt="TrustLink Planet" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Floating Icons around the planet */}
            {/* Top Left - Biometric Solutions */}
            <div className="absolute top-12 left-12 icon-float">
              <div className="bg-gray-900 rounded-full p-4 shadow-lg border-2 border-yellow-400">
                <Fingerprint className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-center mt-2 text-sm font-medium text-yellow-400">Biometric<br/>Verification</p>
            </div>

            {/* Top Right - Blockchain Security */}
            <div className="absolute top-12 right-12 icon-float-delay-1">
              <div className="bg-gray-900 rounded-full p-4 shadow-lg border-2 border-yellow-400">
                <Lock className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-center mt-2 text-sm font-medium text-yellow-400">Blockchain<br/>Security</p>
            </div>

            {/* Bottom Left - Identity Proof */}
            <div className="absolute bottom-12 left-12 icon-float-delay-2">
              <div className="bg-gray-900 rounded-full p-4 shadow-lg border-2 border-yellow-400">
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-center mt-2 text-sm font-medium text-yellow-400">Identity<br/>Proof</p>
            </div>

            {/* Bottom Right - Mobile First */}
            <div className="absolute bottom-12 right-12 icon-float-delay-3">
              <div className="bg-gray-900 rounded-full p-4 shadow-lg border-2 border-yellow-400">
                <Smartphone className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-center mt-2 text-sm font-medium text-yellow-400">Instant<br/>Verification</p>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full">
              <span className="text-yellow-400 mr-2">🛡️</span>
              <span className="text-sm font-medium text-white">Decentralized Identity Verification</span>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                In an era dominated by data breaches and identity fraud, prioritizing trust is essential. Whether you're a bank verifying customers, a fintech validating users, or an institution confirming identities, TrustLink® represents a paradigm shift towards digital authenticity.
              </p>

              <p className="text-gray-300 leading-relaxed">
                TrustLink® is a decentralized identity verification platform that uses biometric authentication and blockchain technology to confirm who you really are—without relying on traditional documents. We create tamper-proof digital identity records, secured on the Arbitrum Stylus blockchain, that prove authenticity, prevent fraud, and ensure everything you verify is the real deal.
              </p>
            </div>

            {/* CTA Button */}
            <button className="px-8 py-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors font-semibold inline-flex items-center shadow-lg">
              Learn More
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;