import React from 'react';

const Stats = () => {
  return (
    <section className="w-full py-10 px-6 bg-navy-dark">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-medium text-white mb-8">
          We have the numbers to back it up.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Satisfied Clients */}
          <div className="stat-card group hover:border-accent-blue/30 transition-all duration-300">
            <div className="flex items-start mb-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center mr-2">
                <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-white">10,000</h3>
              <p className="text-gray-400 text-sm">Satisfied Clients</p>
            </div>
          </div>
          
          {/* Total Volume */}
          <div className="stat-card group hover:border-accent-blue/30 transition-all duration-300">
            <div className="flex items-start mb-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center mr-2">
                <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-white">$13,392</h3>
              <p className="text-gray-400 text-sm">Total Volume Escrowed</p>
            </div>
          </div>
          
          {/* Transactions */}
          <div className="stat-card group hover:border-accent-blue/30 transition-all duration-300">
            <div className="flex items-start mb-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center mr-2">
                <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-white">2,193</h3>
              <p className="text-gray-400 text-sm">Transactions</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <button className="flex items-center text-accent-blue hover:text-accent-purple transition-colors">
            <span>Scroll Down</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 14.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Stats; 