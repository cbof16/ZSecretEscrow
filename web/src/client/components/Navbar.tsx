import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../store/useStore';

const Navbar = () => {
  const { zAddress } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-navy-dark/80 backdrop-blur-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex">
            <div className="w-3 h-3 bg-accent-blue rounded-full"></div>
            <div className="w-3 h-3 bg-accent-purple rounded-full ml-1"></div>
            <div className="w-3 h-3 bg-accent-blue opacity-70 rounded-full ml-1"></div>
          </div>
          <span className="text-white font-bold text-xl">logoipsum</span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-white hover:text-accent-blue transition-colors">
          Home
        </Link>
        <Link href="/about" className="text-white hover:text-accent-blue transition-colors">
          About Us
        </Link>
        <Link href="/events" className="text-white hover:text-accent-blue transition-colors">
          Events
        </Link>
        <Link href="/contact" className="text-white hover:text-accent-blue transition-colors">
          Contact Us
        </Link>
      </div>
      
      <div className="hidden md:block relative">
        {zAddress ? (
          <Link href="/stealth" className="text-white bg-accent-blue/20 hover:bg-accent-blue/30 px-4 py-2 rounded-full transition-colors">
            Dashboard
          </Link>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-navy-light border border-accent-blue/20 rounded-lg shadow-lg py-2 z-10">
                <button className="w-full text-left px-4 py-2 text-white hover:bg-accent-blue/10 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 0H5v10h10V5z" clipRule="evenodd" />
                  </svg>
                  Log In
                </button>
                <button className="w-full text-left px-4 py-2 text-white hover:bg-accent-blue/10 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Create an Account
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <button className="md:hidden text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  );
};

export default Navbar; 