import React, { useState } from 'react';
import useStore from '../store';

export const WalletSetup: React.FC = () => {
  const { createWallet, importWallet, isConnecting, errorMessage } = useStore();
  
  const [mode, setMode] = useState<'create' | 'import'>('create');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [walletLabel, setWalletLabel] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  
  const handleCreateWallet = async () => {
    try {
      setLocalError(null);
      await createWallet(walletLabel);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };
  
  const handleImportWallet = async () => {
    try {
      setLocalError(null);
      
      if (!seedPhrase || seedPhrase.trim() === '') {
        setLocalError('Please enter a valid seed phrase');
        return;
      }
      
      await importWallet(seedPhrase, walletLabel);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Wallet Setup</h2>
      
      {/* Mode tabs */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setMode('create')}
          className={`flex-1 py-2 font-medium ${
            mode === 'create' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Create New Wallet
        </button>
        <button
          onClick={() => setMode('import')}
          className={`flex-1 py-2 font-medium ${
            mode === 'import' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Import Existing
        </button>
      </div>
      
      {/* Wallet label */}
      <div className="mb-4">
        <label htmlFor="walletLabel" className="block text-sm font-medium text-gray-700 mb-1">
          Wallet Label (optional)
        </label>
        <input
          type="text"
          id="walletLabel"
          value={walletLabel}
          onChange={(e) => setWalletLabel(e.target.value)}
          placeholder="My Zcash Wallet"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      {/* Import form */}
      {mode === 'import' && (
        <div className="mb-4">
          <label htmlFor="seedPhrase" className="block text-sm font-medium text-gray-700 mb-1">
            Seed Phrase
          </label>
          <textarea
            id="seedPhrase"
            value={seedPhrase}
            onChange={(e) => setSeedPhrase(e.target.value)}
            placeholder="Enter your seed phrase (12 or 24 words)"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter the seed phrase associated with your existing Zcash wallet
          </p>
        </div>
      )}
      
      {/* Create form */}
      {mode === 'create' && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Create a new Zcash wallet to use with ZSecretEscrow. Your wallet will be used to send and
            receive payments securely.
          </p>
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> When your wallet is created, be sure to securely store your seed phrase. 
              It will be required to recover your wallet if needed.
            </p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {(localError || errorMessage) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{localError || errorMessage}</p>
        </div>
      )}
      
      {/* Action button */}
      <button
        onClick={mode === 'create' ? handleCreateWallet : handleImportWallet}
        disabled={isConnecting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <span className="flex items-center justify-center">
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : mode === 'create' ? (
          'Create Wallet'
        ) : (
          'Import Wallet'
        )}
      </button>
    </div>
  );
}; 