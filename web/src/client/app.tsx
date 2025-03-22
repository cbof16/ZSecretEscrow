import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Stealth } from './views/stealth';
import useStore from './store';
import loadServices from './serviceLoader';

export function App() {
  const router = useRouter();
  const { userId, setUserId, initializeServices } = useStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize services on component mount
  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load services
        const servicesLoaded = await loadServices();
        if (!servicesLoaded) {
          throw new Error('Failed to load services');
        }
        
        // Initialize services
        const initialized = await initializeServices();
        if (!initialized) {
          throw new Error('Failed to initialize services');
        }
        
        // Check if user is logged in from local storage
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsLoading(false);
      }
    }
    
    init();
  }, [initializeServices, setUserId]);
  
  // Handle login
  const handleLogin = (id: string) => {
    setUserId(id);
    localStorage.setItem('userId', id);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading ZSecretEscrow...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Show login if no user
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">ZSecretEscrow</h1>
          <p className="mb-6 text-gray-700 text-center">
            A private escrow system built on Zcash
          </p>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Enter User ID
            </label>
            <input
              type="text"
              id="userId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your user ID"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  handleLogin(e.currentTarget.value);
                }
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const input = document.getElementById('userId') as HTMLInputElement;
                if (input && input.value) {
                  handleLogin(input.value);
                }
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Main application
  return <Stealth />;
} 