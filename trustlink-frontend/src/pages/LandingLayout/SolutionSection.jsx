import React from 'react';

const SolutionSection = () => {
  return (
    <section className="bg-black py-20 relative overflow-hidden">
      <style>{`
        @keyframes float-image {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .image-float {
          animation: float-image 4s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Digital Solution <span className="text-yellow-400">TrustLink Made</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full">
              <span className="text-yellow-400 mr-2">⚡</span>
              <span className="text-sm font-medium text-white">Seamless Verification Process</span>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                TrustLink eliminates the complexity of traditional KYC processes by replacing document verification with advanced biometric authentication. Our platform ensures instant identity confirmation without the need for government-issued IDs like NIN or international passports.
              </p>

              <p className="text-gray-300 leading-relaxed">
                Built on the Arbitrum Stylus blockchain, TrustLink creates immutable verification records that can be accessed by banks, fintechs, and institutions worldwide. This decentralized approach ensures privacy, security, and transparency at every step.
              </p>

              <p className="text-gray-300 leading-relaxed">
                With features like Face ID authentication, fingerprint scanning, and geo-location verification, TrustLink provides a comprehensive identity solution that's fast, secure, and accessible to everyone—regardless of their documentation status.
              </p>
            </div>

            {/* CTA Button */}
            <button className="px-8 py-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors font-semibold inline-flex items-center shadow-lg">
              Explore Features
              <span className="ml-2">→</span>
            </button>
          </div>

          {/* Right Side - Floating Image */}
          <div className="relative h-[500px] flex items-center justify-center order-1 lg:order-2">
            <div className="relative image-float">
              {/* INSERT YOUR IMAGE HERE */}
              <div className="w-full max-w-lg">
                <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-3xl p-8 border-2 border-yellow-400/30 shadow-2xl backdrop-blur-sm">
                  <img 
                    src="/path-to-your-solution-image.png" 
                    alt="TrustLink Solution" 
                    className="w-full h-auto rounded-2xl"
                  />
                  {/* Placeholder */}
                  <div className="w-full h-96 bg-gray-900/50 rounded-2xl flex items-center justify-center">
                    <span className="text-gray-500 text-center px-4">
                      INSERT YOUR SOLUTION IMAGE HERE
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative floating dots around image */}
              <div className="absolute -top-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute top-1/2 -left-6 w-2 h-2 bg-yellow-400 rounded-full opacity-40 animate-pulse"></div>
              <div className="absolute top-1/4 -right-6 w-2 h-2 bg-yellow-400 rounded-full opacity-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;