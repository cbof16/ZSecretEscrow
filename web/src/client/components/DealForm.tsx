import React, { useState } from 'react';
import { useStore } from '../store/useStore';

interface DealFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DealForm: React.FC<DealFormProps> = ({ isOpen, onClose }) => {
  const { isCreateDealOpen, closeCreateDealModal, addDeal, zAddress } = useStore();
  const [job, setJob] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientZAddress, setRecipientZAddress] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!job || !amount || !recipientZAddress || !releaseDate) {
      alert('Please fill in all fields');
      return;
    }
    
    // Parse date to timestamp
    const releaseDateObj = new Date(releaseDate);
    const releaseDateTimestamp = releaseDateObj.toISOString();
    
    // Create the deal
    addDeal({
      job,
      amount: parseFloat(amount),
      senderZAddress: zAddress!,
      recipientZAddress,
      releaseDate: releaseDateTimestamp
    });
    
    // Reset form
    setJob('');
    setAmount('');
    setRecipientZAddress('');
    setReleaseDate('');
  };
  
  // Function to get the minimum date for the release date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  if (!isCreateDealOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="animate-slideIn glass-card max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Create New Deal</h2>
          <button 
            onClick={closeCreateDealModal}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="job" className="block text-sm font-medium text-gray-400 mb-1">
              Job Title
            </label>
            <input
              type="text"
              id="job"
              className="input-primary"
              placeholder="e.g. Logo Design"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
              Amount (ZEC)
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0.01"
              className="input-primary"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-400 mb-1">
              Recipient z-address
            </label>
            <input
              type="text"
              id="recipient"
              className="input-primary"
              placeholder="z1..."
              value={recipientZAddress}
              onChange={(e) => setRecipientZAddress(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-400 mb-1">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              className="input-primary"
              min={getMinDate()}
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeCreateDealModal}
              className="flex-1 px-4 py-2 border border-accent-blue/50 text-white rounded-lg hover:bg-accent-blue/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-purple transition"
            >
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};