import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import WhyChooseUs from '../components/WhyChooseUs';
import { useStore } from '../store/useStore';

const Home: NextPage = () => {
  const { zAddress } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-navy-dark">
      <Head>
        <title>ZSecretEscrow - Privacy-first escrow for Zcash</title>
        <meta name="description" content="Secure, private escrow service using Zcash's shielded transactions and smart contracts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Stats />
        <WhyChooseUs />
        
        {/* Footer */}
        <footer className="bg-navy-dark py-8 px-6 border-t border-accent-blue/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="flex mr-2">
                  <div className="w-3 h-3 bg-accent-blue rounded-full"></div>
                  <div className="w-3 h-3 bg-accent-purple rounded-full ml-1"></div>
                  <div className="w-3 h-3 bg-accent-blue opacity-70 rounded-full ml-1"></div>
                </div>
                <span className="text-white font-bold text-xl">ZSecretEscrow</span>
              </div>
              <p className="text-gray-400 text-sm">Privacy-first escrow for anything</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="text-white font-bold mb-3">Resources</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="hover:text-accent-blue transition-colors"><a href="#">Documentation</a></li>
                  <li className="hover:text-accent-blue transition-colors"><a href="#">API Reference</a></li>
                  <li className="hover:text-accent-blue transition-colors"><a href="#">Security</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-3">Connect</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="hover:text-accent-blue transition-colors"><a href="#">Twitter</a></li>
                  <li className="hover:text-accent-blue transition-colors"><a href="#">Discord</a></li>
                  <li className="hover:text-accent-blue transition-colors"><a href="#">GitHub</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-3">Legal</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="hover:text-accent-blue transition-colors"><a href="#">Privacy Policy</a></li>
                  <li className="hover:text-accent-blue transition-colors"><a href="#">Terms of Service</a></li>
                  <li className="hover:text-accent-blue transition-colors"><a href="#">Compliance</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-accent-blue/10 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} ZSecretEscrow. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;