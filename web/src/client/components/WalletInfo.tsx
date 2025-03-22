import React, { useEffect } from 'react';
import useStore from '../store';

export const WalletInfo: React.FC = () => {
  const { wallet, balance, refreshBalance, zAddress, addFunds } = useStore();
  
  // Refresh balance every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshBalance();
    }, 30000);
    
    // Initial refresh
    refreshBalance();
    
    return () => clearInterval(interval);
  }, [refreshBalance]);
  
  if (!wallet || !zAddress) {
    return null;
  }
  
  // Format balance to 8 decimal places
  const formattedBalance = balance.toFixed(8);
  
  // Format address for display (truncate middle)
  const formatAddress = (address: string) => {
    if (address.length <= 15) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };
  
  // Copy address to clipboard
  const copyAddress = () => {
    if (zAddress) {
      navigator.clipboard.writeText(zAddress)
        .then(() => {
          alert('Address copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy address:', err);
        });
    }
  };
  
  // For demo purposes, add test funds
  const handleAddTestFunds = async () => {
    try {
      await addFunds(1.0); // Add 1 ZEC for testing
    } catch (error) {
      console.error('Error adding test funds:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Your Wallet</h3>
        <button 
          onClick={refreshBalance}
          className="text-blue-600 hover:text-blue-800"
          title="Refresh Balance"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </button>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Balance</span>
          <span className="font-medium text-lg">{formattedBalance} ZEC</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Shielded Address</span>
          <button 
            onClick={copyAddress}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Copy
          </button>
        </div>
        <div className="bg-gray-100 rounded p-2 text-sm font-mono break-all">
          {formatAddress(zAddress)}
        </div>
      </div>
      
      {/* For demo/testing purposes only */}
      <div className="border-t pt-3 mt-3">
        <button
          onClick={handleAddTestFunds}
          className="w-full bg-green-600 text-white py-1.5 px-3 rounded text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          + Add Test Funds (1 ZEC)
        </button>
        <p className="text-xs text-gray-500 text-center mt-1">
          For demonstration purposes only
        </p>
      </div>
    </div>
  );
}; 