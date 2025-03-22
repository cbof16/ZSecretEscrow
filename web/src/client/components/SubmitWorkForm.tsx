import React, { useState } from 'react';
import { useStore } from '../store/useStore';

interface SubmitWorkFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitWorkForm: React.FC<SubmitWorkFormProps> = ({ isOpen, onClose }) => {
  const { currentDealId, submitWork, isSubmitWorkOpen, closeSubmitWorkModal } = useStore();
  const [proof, setProof] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!proof) {
      alert('Please provide a proof link');
      return;
    }
    
    submitWork(currentDealId!, proof, notes);
    
    // Reset form
    setProof('');
    setNotes('');
  };

  if (!isSubmitWorkOpen) return null;

  return !isSubmitWorkOpen ? null : (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="animate-slideIn glass-card max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Submit Work</h2>
          <button 
            onClick={closeSubmitWorkModal}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="proof" className="block text-sm font-medium text-gray-400 mb-1">
              Proof of Work (Link)
            </label>
            <input
              type="url"
              id="proof"
              className="input-primary"
              placeholder="https://..."
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide a link to a shared folder, GitHub repository, or any proof of work.
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={4}
              className="input-primary resize-none"
              placeholder="Add any relevant notes or information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeSubmitWorkModal}
              className="flex-1 px-4 py-2 border border-accent-blue/50 text-white rounded-lg hover:bg-accent-blue/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-purple transition"
            >
              Submit Work
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitWorkForm; 