import React from 'react';
import Link from 'next/link';
import { useStore } from '../store/useStore';

const Hero = () => {
  const { zAddress, setZAddress } = useStore();
  
  const handleConnect = () => {
    const address = prompt('Enter your Zcash address:');
    if (address) {
      setZAddress(address);
    }
  };

  return (
    <section className="w-full py-12 md:py-20 bg-navy px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent-blue mb-4">
            Trusted crypto<br />
            escrow service.
          </h1>
          <p className="text-gray-300 mb-6 max-w-lg">
            We offer escrow services for anything, physical or intangible.
            As of right now, crypto is the only method of escrow because it's
            extremely simple and easy for all parties to complete a transaction
            without any issues.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-5 py-3 bg-accent-blue text-white rounded-full hover:bg-accent-purple transition-all">
              Learn More
            </button>
            
            <button className="px-5 py-3 border border-accent-blue/30 text-white rounded-full flex items-center gap-2 hover:bg-accent-blue/10 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Get in Touch
            </button>
          </div>
        </div>
        
        <div className="md:w-1/2 relative">
          <div className="w-full h-96 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 rounded-full blur-3xl opacity-30"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="w-64 h-64 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 shadow-xl transform rotate-3">
                <div className="h-full w-full bg-navy-light rounded-lg flex flex-col items-center justify-center">
                  <div className="w-40 h-40 bg-navy-dark/70 rounded-lg flex items-center justify-center">
                    <div className="w-32 h-24 bg-white/5 rounded-md relative">
                      {/* Stylized bank/vault building */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-12 h-6 bg-accent-blue/80 rounded-t-full"></div>
                      <div className="absolute bottom-0 w-full h-4/5 bg-white/10 rounded">
                        {/* Columns */}
                        <div className="absolute inset-x-2 bottom-0 h-3/4 flex justify-between">
                          <div className="w-1 h-full bg-white/20 rounded-t"></div>
                          <div className="w-1 h-full bg-white/20 rounded-t"></div>
                          <div className="w-1 h-full bg-white/20 rounded-t"></div>
                          <div className="w-1 h-full bg-white/20 rounded-t"></div>
                          <div className="w-1 h-full bg-white/20 rounded-t"></div>
                          <div className="w-1 h-full bg-white/20 rounded-t"></div>
                        </div>
                        {/* Roof */}
                        <div className="absolute top-0 left-0 right-0 h-1/4 bg-white/5 rounded-t"></div>
                        {/* Gold coin */}
                        <div className="absolute top-1/4 right-2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Login/Account buttons */}
          <div className="absolute top-1/4 right-8 bg-navy-light/90 backdrop-blur-sm border border-accent-blue/10 rounded p-2 shadow-lg">
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 px-4 py-2 text-white hover:bg-accent-blue/10 rounded transition-colors text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Log In
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-white hover:bg-accent-blue/10 rounded transition-colors text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create an Account
              </button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-accent-blue rounded-full opacity-70"></div>
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-accent-purple rounded-full opacity-70"></div>
          <div className="absolute bottom-1/2 left-1/2 w-3 h-3 bg-accent-blue rounded-full opacity-70"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 