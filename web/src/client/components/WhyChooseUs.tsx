import React from 'react';

const WhyChooseUs = () => {
  return (
    <section className="w-full py-16 px-6 bg-navy">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-0">
            Why choose us<span className="text-accent-purple">?</span>
          </h2>
          <p className="text-gray-300 max-w-lg">
            We make the process simple and effortless.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-navy-light/30 backdrop-blur-sm rounded-xl p-6 border border-accent-blue/10 hover:border-accent-blue/30 transition-all">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Secure by Design</h3>
            <p className="text-gray-400">
              Our platform uses advanced encryption and multi-signature technology to ensure your funds are always protected.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-navy-light/30 backdrop-blur-sm rounded-xl p-6 border border-accent-blue/10 hover:border-accent-blue/30 transition-all">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Low Fees</h3>
            <p className="text-gray-400">
              We charge industry-leading low fees, ensuring both parties get the most value from each transaction.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-navy-light/30 backdrop-blur-sm rounded-xl p-6 border border-accent-blue/10 hover:border-accent-blue/30 transition-all">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Fast Resolution</h3>
            <p className="text-gray-400">
              Our automated systems ensure quick release of funds once conditions are met, with 24/7 support for any issues.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-navy-light/30 backdrop-blur-sm rounded-xl p-6 border border-accent-blue/10 hover:border-accent-blue/30 transition-all">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Multiple Currencies</h3>
            <p className="text-gray-400">
              Support for all major cryptocurrencies, allowing you to use your preferred digital assets.
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-navy-light/30 backdrop-blur-sm rounded-xl p-6 border border-accent-blue/10 hover:border-accent-blue/30 transition-all">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Verified Identities</h3>
            <p className="text-gray-400">
              Optional identity verification for high-value transactions, adding an extra layer of security.
            </p>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-navy-light/30 backdrop-blur-sm rounded-xl p-6 border border-accent-blue/10 hover:border-accent-blue/30 transition-all">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Customizable Terms</h3>
            <p className="text-gray-400">
              Create custom escrow agreements with specific conditions and timelines tailored to your needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 