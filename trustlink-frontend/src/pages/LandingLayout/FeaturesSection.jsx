import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Fingerprint, CreditCard, Users, Blocks, Award, Smartphone, MapPin } from 'lucide-react';

const FeaturesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: <Fingerprint className="w-12 h-12 text-yellow-400" />,
      title: "Biometric Verification",
      description: "Biometric Verification provides instant access to key identity details like who, where, and when, making secure authentication effortless using Face ID and fingerprint scanning."
    },
    {
      icon: <CreditCard className="w-12 h-12 text-yellow-400" />,
      title: "TrustPassport",
      description: "TrustPassport offers a simple solution for creating your digital identity, linking your blockchain-verified ID to your profile without relying on traditional government documents."
    },
    {
      icon: <Users className="w-12 h-12 text-yellow-400" />,
      title: "Community Voucher",
      description: "Community Voucher allows trusted members to verify and vouch for new users, building a decentralized web of trust that strengthens identity authenticity across the network."
    },
    {
      icon: <Blocks className="w-12 h-12 text-yellow-400" />,
      title: "Blockchain Integration",
      description: "Blockchain Integration transforms verification records into immutable, tamper-proof digital certificates - authenticated by Arbitrum Stylus and recorded permanently on-chain."
    },
    {
      icon: <Award className="w-12 h-12 text-yellow-400" />,
      title: "TrustScore",
      description: "TrustScore generates a dynamic reputation score based on your verification history, community vouches, and activity, helping institutions assess trustworthiness at a glance."
    },
    {
      icon: <Smartphone className="w-12 h-12 text-yellow-400" />,
      title: "Device Verification",
      description: "Device Verification links your trusted devices to your identity, ensuring secure access from recognized hardware and preventing unauthorized login attempts."
    },
    {
      icon: <MapPin className="w-12 h-12 text-yellow-400" />,
      title: "Address Verification (Geolocation)",
      description: "Address Verification uses geolocation data to confirm your physical location, adding an extra layer of security and fraud prevention to your identity verification process."
    }
  ];

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(features.length / itemsPerSlide);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const getVisibleFeatures = () => {
    const start = currentSlide * itemsPerSlide;
    const end = start + itemsPerSlide;
    return features.slice(start, end);
  };

  const isAtStart = currentSlide === 0;
  const isAtEnd = currentSlide === totalSlides - 1;

  return (
    <section className="bg-black py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Our Core Features <span className="text-yellow-400">That Set Us Apart</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            TrustLink ensures authenticity, security, and transparency with tamper-proof verification. Explore the key features that make us the future of verifiable digital integrity.
          </p>
        </div>

        {/* Features Cards */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {getVisibleFeatures().map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/50 border-2 border-dashed border-yellow-400/30 rounded-2xl p-8 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/10"
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-center mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="text-center">
                  <button className="text-white font-medium hover:text-yellow-400 transition-colors inline-flex items-center">
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              disabled={isAtStart}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none ${
                isAtStart
                  ? 'bg-gray-800 border-2 border-gray-700 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 border-2 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:border-yellow-400 hover:text-black'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              disabled={isAtEnd}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none ${
                isAtEnd
                  ? 'bg-gray-800 border-2 border-gray-700 text-gray-600 cursor-not-allowed'
                  : 'bg-yellow-400 text-black hover:bg-yellow-500'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 focus:outline-none ${
                  currentSlide === index
                    ? 'w-8 h-2 bg-yellow-400 rounded-full'
                    : 'w-2 h-2 bg-gray-700 rounded-full hover:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;