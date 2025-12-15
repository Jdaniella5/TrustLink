import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is TrustLink?",
      answer: "TrustLink is a decentralized identity verification platform that uses biometric authentication and blockchain technology to confirm your identity without traditional documents. We leverage Face ID, fingerprint scanning, and geo-location to create tamper-proof digital identity records on the Arbitrum Stylus blockchain."
    },
    {
      question: "How does biometric verification work?",
      answer: "Our biometric verification system captures your Face ID or fingerprint, converts it into a unique cryptographic hash, and stores it securely on the blockchain. This ensures your biometric data is never stored directly, only its mathematical representation, which cannot be reverse-engineered."
    },
    {
      question: "Do I need government-issued IDs to use TrustLink?",
      answer: "No! That's the beauty of TrustLink. We eliminate the need for traditional documents like NIN or international passports. Your identity is verified through biometrics and blockchain technology, making verification accessible to everyone regardless of documentation status."
    },
    {
      question: "Is my data secure on TrustLink?",
      answer: "Absolutely. TrustLink uses advanced encryption and stores only hashed representations of your biometric data on the Arbitrum Stylus blockchain. This ensures your data is immutable, tamper-proof, and cannot be accessed or reconstructed by unauthorized parties."
    },
    {
      question: "Which institutions can use TrustLink?",
      answer: "TrustLink is designed for banks, fintech companies, KYC providers, and any institution requiring identity verification. We provide API integrations that allow seamless incorporation into existing systems for instant, secure user onboarding."
    },
    {
      question: "How long does verification take?",
      answer: "TrustLink verification is instant! Unlike traditional KYC processes that can take days, our biometric and blockchain-based system confirms your identity in seconds, allowing for real-time onboarding and authentication."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-black py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Text Content */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full">
              <span className="text-yellow-400 mr-2">❓</span>
              <span className="text-sm font-medium text-white">Got Questions?</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Frequently Asked <span className="text-yellow-400">Questions</span>
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Have questions about TrustLink? We've compiled answers to the most common inquiries about our decentralized identity verification platform. If you don't find what you're looking for, feel free to reach out to our team.
            </p>

            <div className="pt-4">
              <button className="px-8 py-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors font-semibold inline-flex items-center shadow-lg">
                Contact Support
                <span className="ml-2">→</span>
              </button>
            </div>

            {/* Stats or additional info */}
            <div className="pt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-yellow-400">24/7</p>
                <p className="text-gray-400 text-sm mt-1">Customer Support</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-400">100%</p>
                <p className="text-gray-400 text-sm mt-1">Secure & Private</p>
              </div>
            </div>
          </div>

          {/* Right Side - FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900/50 border border-yellow-400/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-yellow-400/40"
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-yellow-400 transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-5 text-gray-300 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;