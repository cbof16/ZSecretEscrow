import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { DealCard } from '../components/DealCard';
import { DealForm } from '../components/DealForm';
import SubmitWorkForm from '../components/SubmitWorkForm';
import ReviewWorkForm from '../components/ReviewWorkForm';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

const StealthDashboard: NextPage = () => {
  const router = useRouter();
  const {
    zAddress,
    deals,
    balance,
    isCreateDealOpen,
    isSubmitWorkOpen,
    isReviewWorkOpen,
    openCreateDealModal,
    closeCreateDealModal,
    closeSubmitWorkModal,
    closeReviewWorkModal,
  } = useStore();

  useEffect(() => {
    if (!zAddress) {
      router.push('/');
    }
  }, [zAddress, router]);

  if (!zAddress) return null;

  // Filter deals by status
  const activeDeals = deals.filter(
    deal => deal.status === 'locked' || deal.status === 'work_submitted' || deal.status === 'under_challenge'
  );

  const completedDeals = deals.filter(
    deal => deal.status === 'completed' || deal.status === 'refunded'
  );

  // Format date helper function
  const formatDate = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, yyyy');
  };

  return (
    <div className="min-h-screen bg-navy-dark text-white">
      <Head>
        <title>ZSecretEscrow - Dashboard</title>
        <meta name="description" content="Manage your deals securely" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome back, your current balance is {balance} ZEC</p>
          </div>
          <button onClick={openCreateDealModal} className="btn-primary">
            Create New Deal
          </button>
        </div>

        {/* Active Deals Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Active Deals</h2>

          {activeDeals.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-gray-400">No active deals. Create a new deal to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </section>

        {/* Completed Deals Section */}
        {completedDeals.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Completed Deals</h2>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-accent-blue/20">
                      <th className="text-left p-4">Deal</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedDeals.map(deal => (
                      <tr key={deal.id} className="border-b border-accent-blue/10 hover:bg-navy-light/50">
                        <td className="p-4 text-sm">{deal.job}</td>
                        <td className="p-4 text-sm">{deal.amount.toFixed(2)} ZEC</td>
                        <td className="p-4 text-sm">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              deal.status === 'completed'
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-gray-500/20 text-gray-300'
                            }`}
                          >
                            {deal.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-400">{formatDate(deal.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Modal Components */}
      <DealForm isOpen={isCreateDealOpen} onClose={closeCreateDealModal} />
      <SubmitWorkForm isOpen={isSubmitWorkOpen} onClose={closeSubmitWorkModal} />
      <ReviewWorkForm isOpen={isReviewWorkOpen} onClose={closeReviewWorkModal} />
    </div>
  );
};

export default StealthDashboard;