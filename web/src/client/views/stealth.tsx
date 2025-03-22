import React, { useEffect } from 'react';
import { DealCard } from '../components/DealCard';
import { DealForm } from '../components/DealForm';
import { SubmitWorkForm } from '../components/SubmitWorkForm';
import { ReviewWorkForm } from '../components/ReviewWorkForm';
import { WalletSetup } from '../components/WalletSetup';
import { WalletInfo } from '../components/WalletInfo';
import useStore from '../store';

export function Stealth() {
  const { 
    userId, 
    wallet,
    deals, 
    fetchDeals,
    isCreateDealOpen, 
    isSubmitWorkOpen, 
    isReviewWorkOpen, 
    openCreateDeal, 
    currentDealId,
    isClient
  } = useStore();
  
  // Fetch deals on component mount
  useEffect(() => {
    if (userId) {
      fetchDeals();
    }
  }, [userId, fetchDeals]);
  
  // Filter deals based on status
  const activeDeals = deals.filter(deal => 
    deal.status !== 'completed' && deal.status !== 'cancelled'
  );
  
  const completedDeals = deals.filter(deal => 
    deal.status === 'completed' || deal.status === 'cancelled'
  );
  
  // Get current deal for modals
  const currentDeal = currentDealId 
    ? deals.find(deal => deal.dealId === currentDealId) 
    : null;
  
  // Helper function to format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            {/* Left sidebar - wallet info */}
            <div className="w-full md:w-1/4">
              {/* Show wallet setup or wallet info */}
              {!wallet ? (
                <WalletSetup />
              ) : (
                <WalletInfo />
              )}
            </div>
            
            {/* Main content area */}
            <div className="w-full md:w-3/4">
              {/* Header section */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <div className="flex items-center space-x-4">
                  {/* Show Create Deal button only for clients with wallet */}
                  {isClient && wallet && (
                    <button
                      onClick={openCreateDeal}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      Create New Deal
                    </button>
                  )}
                  
                  {/* Switch between client/freelancer view */}
                  <div className="bg-white rounded-md shadow p-1 flex">
                    <button
                      onClick={() => useStore.setState({ isClient: true })}
                      className={`px-3 py-1 rounded-md ${
                        isClient 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Client
                    </button>
                    <button
                      onClick={() => useStore.setState({ isClient: false })}
                      className={`px-3 py-1 rounded-md ${
                        !isClient 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Freelancer
                    </button>
                  </div>
                </div>
              </div>
              
              {/* No wallet warning */}
              {!wallet && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        You need to set up a Zcash wallet before you can create or participate in deals.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Active deals section */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">Active Deals</h2>
                
                {activeDeals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No active deals found.</p>
                    {isClient && wallet && (
                      <button
                        onClick={openCreateDeal}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                      >
                        Create Your First Deal
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeDeals.map(deal => (
                      <DealCard 
                        key={deal.dealId}
                        deal={deal}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Completed deals section */}
              {completedDeals.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-4">Deal History</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Deal
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            With
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {completedDeals.map(deal => (
                          <tr key={deal.dealId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {deal.description.length > 30 
                                ? `${deal.description.substring(0, 30)}...` 
                                : deal.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {isClient 
                                ? `Freelancer ${deal.freelancer.id.substring(0, 8)}` 
                                : `Client ${deal.client.id.substring(0, 8)}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {deal.amountZec} ZEC
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(deal.status)}`}>
                                {deal.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(deal.updatedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {isCreateDealOpen && <DealForm />}
      
      {isSubmitWorkOpen && currentDeal && (
        <SubmitWorkForm deal={currentDeal} />
      )}
      
      {isReviewWorkOpen && currentDeal && (
        <ReviewWorkForm deal={currentDeal} />
      )}
    </div>
  );
} 