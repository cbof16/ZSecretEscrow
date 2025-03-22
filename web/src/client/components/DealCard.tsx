import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useStore } from '../store/useStore';

export interface DealCardProps {
  deal: {
    id: string;
    job: string;
    amount: number;
    senderZAddress: string;
    recipientZAddress: string;
    releaseDate: string;
    status: 'locked' | 'work_submitted' | 'under_challenge' | 'completed' | 'refunded';
    progress: number;
    timestamp: string;
    proof?: string;
    notes?: string;
  };
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const { zAddress, openSubmitWorkModal, openReviewWorkModal } = useStore();
  
  const isClient = zAddress === deal.senderZAddress;
  const isFreelancer = zAddress === deal.recipientZAddress;
  
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(deal.amount);
  
  const formattedDate = formatDistanceToNow(new Date(deal.releaseDate), { addSuffix: true });
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'locked':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'work_submitted':
        return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
      case 'under_challenge':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'refunded':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const renderActionButton = () => {
    if (isFreelancer) {
      if (deal.status === 'locked') {
        return (
          <button
            onClick={() => openSubmitWorkModal(deal.id)}
            className="btn-primary py-2 text-sm w-full"
          >
            Submit Work
          </button>
        );
      }
    } else if (isClient) {
      if (deal.status === 'work_submitted') {
        return (
          <button
            onClick={() => openReviewWorkModal(deal.id)}
            className="btn-primary py-2 text-sm w-full"
          >
            Review Work
          </button>
        );
      }
    }
    
    // Return disabled button with appropriate text based on status
    let buttonText = "No Actions Available";
    
    if (deal.status === 'locked' && isClient) {
      buttonText = "Awaiting Work Submission";
    } else if (deal.status === 'work_submitted' && isFreelancer) {
      buttonText = "Awaiting Review";
    } else if (deal.status === 'completed') {
      buttonText = "Deal Completed";
    } else if (deal.status === 'under_challenge') {
      buttonText = "Under Dispute";
    } else if (deal.status === 'refunded') {
      buttonText = "Refunded";
    }
    
    return (
      <button disabled className="btn-outline opacity-50 cursor-not-allowed py-2 text-sm w-full">
        {buttonText}
      </button>
    );
  };

  return (
    <div className="glass-card p-4 mb-4 overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-white truncate">{deal.job}</h3>
        <div className={`rounded-full px-3 py-1 text-xs border ${getStatusBadgeColor(deal.status)}`}>
          {deal.status.replace('_', ' ').charAt(0).toUpperCase() + deal.status.replace('_', ' ').slice(1)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-400">
        <div>
          <p className="mb-1">Amount</p>
          <p className="text-white font-medium">{formattedAmount}</p>
        </div>
        <div>
          <p className="mb-1">Release</p>
          <p className="text-white font-medium">{formattedDate}</p>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        {deal.proof && (
          <a 
            href={deal.proof} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent-blue hover:text-accent-purple text-xs underline transition"
          >
            View Proof of Work
          </a>
        )}
        {renderActionButton()}
      </div>
    </div>
  );
};
