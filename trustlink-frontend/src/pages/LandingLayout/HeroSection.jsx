import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-black text-white py-20 relative overflow-hidden min-h-[600px]">
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -40px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, 30px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 40px); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, -20px); }
        }
        @keyframes float5 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(35px, 25px); }
        }
        @keyframes float6 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-25px, 35px); }
        }
        .float-1 { animation: float1 8s ease-in-out infinite; }
        .float-2 { animation: float2 10s ease-in-out infinite; }
        .float-3 { animation: float3 7s ease-in-out infinite; }
        .float-4 { animation: float4 9s ease-in-out infinite; }
        .float-5 { animation: float5 11s ease-in-out infinite; }
        .float-6 { animation: float6 6s ease-in-out infinite; }
      `}</style>
      
      {/* Decorative glowing animated dots */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-300 rounded-full opacity-70 animate-pulse float-1 shadow-lg shadow-yellow-300/50"></div>
      <div className="absolute top-40 right-20 w-4 h-4 bg-yellow-300 rounded-full opacity-60 animate-pulse float-2 shadow-lg shadow-yellow-300/50"></div>
      <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-yellow-300 rounded-full opacity-50 animate-pulse float-3 shadow-lg shadow-yellow-300/50"></div>
      <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-yellow-300 rounded-full opacity-60 animate-pulse float-4 shadow-lg shadow-yellow-300/50"></div>
      <div className="absolute bottom-32 right-1/4 w-4 h-4 bg-yellow-300 rounded-full opacity-50 animate-pulse float-5 shadow-lg shadow-yellow-300/50"></div>
      <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-yellow-300 rounded-full opacity-40 animate-pulse float-6 shadow-lg shadow-yellow-300/50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center px-5 py-2 bg-yellow-300/10 border border-yellow-300/30 rounded-full mb-8">
            <span className="text-yellow-300 mr-2">🔗</span>
            <span className="text-sm font-medium text-white">Modernizing Digital Identity</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            TrustLink® - Connecting the<br />
            <span className="text-yellow-300">Physical & Digital</span> Seamlessly
          </h1>

          {/* Subheading */}
          <p className="text-gray-400 text-lg md:text-xl max-w-4xl mx-auto mb-10 leading-relaxed">
            TrustLink® is a digital platform that connects the physical world with the digital, keeping your products,
            services, and events secure and easy to verify.
          </p>

          {/* CTA Button */}
          <button className="px-10 py-3.5 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-colors text-lg font-semibold inline-flex items-center shadow-lg shadow-yellow-300/30">
            Learn More
            <span className="ml-2">→</span>
          </button>
        </div>

        {/* Image Section - Replace with your actual images */}
        <div className="relative mt-20">
          {/* Dark curved background with gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent rounded-t-[100px]"></div>
          
          {/* Device mockups container */}
          <div className="relative z-10 flex justify-center items-end space-x-8 px-4">
            {/* Left Phone */}
            <div className="w-48 h-auto">
              {/* INSERT YOUR LEFT PHONE IMAGE HERE */}
              <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl border-2 border-yellow-300/20" style={{ aspectRatio: '9/19' }}>
                <div className="bg-gray-800 w-full h-full rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500 text-xs text-center p-2">INSERT LEFT PHONE IMAGE HERE</span>
                </div>
              </div>
            </div>

            {/* Center Laptop */}
            <div className="w-80 h-auto -mb-8">
              {/* INSERT YOUR LAPTOP IMAGE HERE */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border-2 border-yellow-300/20" style={{ aspectRatio: '16/10' }}>
                <div className="bg-gray-800 w-full h-full rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-center">INSERT LAPTOP IMAGE HERE</span>
                </div>
              </div>
            </div>

            {/* Right Phone */}
            <div className="w-48 h-auto">
              {/* INSERT YOUR RIGHT PHONE IMAGE HERE */}
              <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl border-2 border-yellow-300/20" style={{ aspectRatio: '9/19' }}>
                <div className="bg-gray-800 w-full h-full rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500 text-xs text-center p-2">INSERT RIGHT PHONE IMAGE HERE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dotted line decoration */}
          <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-yellow-300/20 transform -translate-y-1/2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;