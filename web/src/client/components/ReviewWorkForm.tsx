import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import ConfirmModal from './ConfirmModal';

interface ReviewWorkFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewWorkForm: React.FC<ReviewWorkFormProps> = ({ isOpen, onClose }) => {
  const { currentDealId, deals, approveWork, challengeDeal, isReviewWorkOpen, closeReviewWorkModal } = useStore();
  const [currentDeal, setCurrentDeal] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (currentDealId) {
      const deal = deals.find(d => d.id === currentDealId);
      setCurrentDeal(deal);
    }
  }, [currentDealId, deals]);

  if (!isReviewWorkOpen || !currentDeal) return null;

  const handleApprove = () => {
    approveWork(currentDeal.id);
    closeReviewWorkModal();
  };

  const handleOpenConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmChallenge = () => {
    challengeDeal(currentDeal.id);
    setShowConfirmModal(false);
    closeReviewWorkModal();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="animate-slideIn glass-card max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Review Work</h2>
            <button
              onClick={closeReviewWorkModal}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">{currentDeal.job}</h3>
            <p className="text-sm text-gray-400 mb-4">Submitted by Freelancer</p>

            {currentDeal.proof && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Proof of Work</label>
                <a
                  href={currentDeal.proof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-navy-dark/50 rounded-lg border border-accent-blue/20 text-accent-blue hover:text-accent-purple transition break-all"
                >
                  {currentDeal.proof}
                </a>
              </div>
            )}

            {currentDeal.notes && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Notes from Freelancer</label>
                <div className="p-3 bg-navy-dark/50 rounded-lg border border-accent-blue/20 text-gray-300">
                  {currentDeal.notes}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Amount to Release</label>
              <div className="p-3 bg-navy-dark/50 rounded-lg border border-accent-blue/20 text-white font-medium">
                {currentDeal.amount.toFixed(2)} ZEC
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleOpenConfirm}
              className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition"
            >
              Challenge Work
            </button>
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-purple transition"
            >
              Approve & Release Funds
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Challenge Work"
        message="Are you sure you want to challenge this work? This will initiate a dispute process that may take additional time to resolve."
        confirmText="Yes, Challenge Work"
        cancelText="Cancel"
        onConfirm={handleConfirmChallenge}
        onCancel={handleCancelConfirm}
      />
    </>
  );
};

export default ReviewWorkForm; 