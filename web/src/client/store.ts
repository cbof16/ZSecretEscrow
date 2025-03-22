import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Load our real services
// In a real implementation, these would be properly bundled and imported
// For demonstration purposes, we're assuming they're available from the window object
declare global {
  interface Window {
    escrowService: any;
    zcashService: any;
    nearService: any;
  }
}

// Define types
export type DealStatus = 'created' | 'submitted' | 'approved' | 'disputed' | 'completed' | 'cancelled';

export interface Deal {
  dealId: string;
  client: {
    id: string;
    nearAccountId: string;
  };
  freelancer: {
    id: string;
    nearAccountId: string;
  };
  amount: string;
  amountZec: number;
  deadline: number;
  description: string;
  status: DealStatus;
  proofLink?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

interface ZcashWallet {
  id: string;
  addresses: {
    transparent: string;
    shielded: string;
  };
  balance: {
    transparent: number;
    shielded: number;
    total: number;
  };
}

interface AppState {
  // User state
  userId: string | null;
  zAddress: string | null;
  wallet: ZcashWallet | null;
  balance: number;
  isClient: boolean;
  
  // Deals
  deals: Deal[];
  currentDealId: string | null;
  
  // UI state
  isCreateDealOpen: boolean;
  isSubmitWorkOpen: boolean;
  isReviewWorkOpen: boolean;
  
  // Service connection state
  isInitialized: boolean;
  isConnecting: boolean;
  errorMessage: string | null;
  
  // Actions
  setUserId: (userId: string | null) => void;
  setIsClient: (isClient: boolean) => void;
  
  // Service initialization
  initializeServices: () => Promise<boolean>;
  
  // Wallet actions
  createWallet: (label?: string) => Promise<void>;
  importWallet: (seedPhrase: string, label?: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
  
  // Deal actions
  fetchDeals: () => Promise<void>;
  createDeal: (freelancerId: string, amount: number, deadlineDays: number, description: string) => Promise<void>;
  submitWork: (dealId: string, proofLink: string, notes?: string) => Promise<void>;
  approveWork: (dealId: string) => Promise<void>;
  disputeWork: (dealId: string) => Promise<void>;
  
  // UI actions
  openCreateDeal: () => void;
  closeCreateDeal: () => void;
  openSubmitWork: (dealId: string) => void;
  closeSubmitWork: () => void;
  openReviewWork: (dealId: string) => void;
  closeReviewWork: () => void;
  
  // Testing/mock
  addFunds: (amount: number) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Default state
      userId: null,
      zAddress: null,
      wallet: null,
      balance: 0,
      isClient: true,
      deals: [],
      currentDealId: null,
      isCreateDealOpen: false,
      isSubmitWorkOpen: false,
      isReviewWorkOpen: false,
      isInitialized: false,
      isConnecting: false,
      errorMessage: null,
      
      // Set basic user properties
      setUserId: (userId) => set({ userId }),
      setIsClient: (isClient) => set({ isClient }),
      
      // Initialize all services
      initializeServices: async () => {
        try {
          set({ isConnecting: true, errorMessage: null });
          
          // Check if services are available
          if (!window.escrowService) {
            throw new Error('Escrow service not available');
          }
          
          // Initialize the escrow service
          const initialized = await window.escrowService.initialize();
          if (!initialized) {
            throw new Error('Failed to initialize escrow service');
          }
          
          // Start monitoring services
          window.escrowService.startServices();
          
          set({ isInitialized: true, isConnecting: false });
          return true;
        } catch (error) {
          console.error('Error initializing services:', error);
          set({ 
            isConnecting: false, 
            errorMessage: error instanceof Error ? error.message : 'Unknown error initializing services' 
          });
          return false;
        }
      },
      
      // Create a new wallet
      createWallet: async (label = '') => {
        try {
          const { userId } = get();
          if (!userId) throw new Error('User ID not set');
          
          set({ isConnecting: true, errorMessage: null });
          
          const wallet = await window.escrowService.createUserWallet(userId, label);
          
          set({ 
            wallet,
            zAddress: wallet.addresses.shielded,
            balance: wallet.balance.total / 100000000, // Convert zatoshi to ZEC
            isConnecting: false
          });
        } catch (error) {
          console.error('Error creating wallet:', error);
          set({ 
            isConnecting: false, 
            errorMessage: error instanceof Error ? error.message : 'Unknown error creating wallet' 
          });
        }
      },
      
      // Import an existing wallet
      importWallet: async (seedPhrase, label = '') => {
        try {
          const { userId } = get();
          if (!userId) throw new Error('User ID not set');
          
          set({ isConnecting: true, errorMessage: null });
          
          const wallet = await window.escrowService.importUserWallet(userId, seedPhrase, label);
          
          set({ 
            wallet,
            zAddress: wallet.addresses.shielded,
            balance: wallet.balance.total / 100000000, // Convert zatoshi to ZEC
            isConnecting: false
          });
        } catch (error) {
          console.error('Error importing wallet:', error);
          set({ 
            isConnecting: false, 
            errorMessage: error instanceof Error ? error.message : 'Unknown error importing wallet' 
          });
        }
      },
      
      // Refresh balance
      refreshBalance: async () => {
        try {
          const { userId, wallet } = get();
          if (!userId || !wallet) return;
          
          // Get updated wallet info
          const updatedWallet = await window.zcashService.getWallet(userId);
          
          set({ 
            wallet: updatedWallet,
            balance: updatedWallet.balance.total / 100000000 // Convert zatoshi to ZEC
          });
        } catch (error) {
          console.error('Error refreshing balance:', error);
        }
      },
      
      // Fetch deals for the current user
      fetchDeals: async () => {
        try {
          const { userId } = get();
          if (!userId) return;
          
          set({ isConnecting: true, errorMessage: null });
          
          const deals = await window.escrowService.getUserDeals(userId);
          
          set({ deals, isConnecting: false });
        } catch (error) {
          console.error('Error fetching deals:', error);
          set({ 
            isConnecting: false, 
            errorMessage: error instanceof Error ? error.message : 'Unknown error fetching deals' 
          });
        }
      },
      
      // Create a new deal
      createDeal: async (freelancerId, amount, deadlineDays, description) => {
        try {
          const { userId } = get();
          if (!userId) throw new Error('User ID not set');
          
          set({ isConnecting: true, errorMessage: null });
          
          // Check if user has sufficient balance
          const hasSufficientBalance = await window.escrowService.checkSufficientBalance(userId, amount);
          if (!hasSufficientBalance) {
            throw new Error(`Insufficient balance. Add funds to your wallet.`);
          }
          
          // Create the deal
          const deal = await window.escrowService.createDeal(
            userId,
            freelancerId,
            amount,
            deadlineDays,
            description
          );
          
          // Refresh deals list
          await get().fetchDeals();
          
          // Close modal
          set({ 
            isCreateDealOpen: false,
            isConnecting: false
          });
          
          // Refresh balance
          await get().refreshBalance();
        } catch (error) {
          console.error('Error creating deal:', error);
          set({ 
            isConnecting: false, 
            errorMessage: error instanceof Error ? error.message : 'Unknown error creating deal' 
          });
        }
      },
      
      // Submit work for a deal
      submitWork: async (dealId, proofLink, notes) => {
        try {
          const { userId } = get();
          if (!userId) throw new Error('User ID not set');
          
          set({ isConnecting: true, errorMessage: null });
          
          await window.escrowService.submitWork(dealId, userId, proofLink, notes);
          
          // Refresh deals list
          await get().fetchDeals();
          
          // Close modal
          set({ 
            isSubmitWorkOpen: false,
            currentDealId: null,
            isConnecting: false
          });
        } catch (error) {
          console.error('Error submitting work:', error);
          set({ 
            isConnecting: false, 
            errorMessage: error instanceof Error ? error.message : 'Unknown error submitting work' 
          });
        }
      },
      
      // Approve work and release payment
      approveWork: async (dealId) => {
        try {
          const { userId } = get();
          if (!userId) throw new Error('User ID not set');
          
          set({ isConnecting: true, errorMessage: null });
          
          await window.escrowService.approveWork(dealId, userId);
          
          // Refresh deals list
          await get().fetchDeals();
          
          // Close modal
          set({ 
            isReviewWorkOpen: false,
            currentDealId: null,
            isConnecting: false
          });
          
          // Refresh balance
          await get().refreshBalance();
        } catch (error) {
          console.error('Error approving work:', error);
          set({ 
            isConnecting: false, 
            errorMessage: error instanceof Error ? error.message : 'Unknown error approving work' 
          });
        }
      },
      
      // Dispute work
      disputeWork: async (dealId) => {
        try {
          const { userId } = get();
          if (!userId) throw new Error('User ID not set');
          
          set({ isConnecting: true, errorMessage: null });
          
          await window.escrowService.disputeWork(dealId, userId);
          
          // Refresh deals list
          await get().fetchDeals();
          
          // Close modal
          set({ 
            isReviewWorkOpen: false,
            currentDealId: null,
            isConnecting: false
          });
        } catch (error) {
          console.error('Error disputing work:', error);
          set({ 
            isConnecting: false, 
            errorMessage: error instanceof Error ? error.message : 'Unknown error disputing work' 
          });
        }
      },
      
      // UI actions for modals
      openCreateDeal: () => set({ isCreateDealOpen: true }),
      closeCreateDeal: () => set({ isCreateDealOpen: false }),
      
      openSubmitWork: (dealId) => set({ 
        isSubmitWorkOpen: true,
        currentDealId: dealId
      }),
      closeSubmitWork: () => set({ 
        isSubmitWorkOpen: false,
        currentDealId: null
      }),
      
      openReviewWork: (dealId) => set({ 
        isReviewWorkOpen: true,
        currentDealId: dealId
      }),
      closeReviewWork: () => set({ 
        isReviewWorkOpen: false,
        currentDealId: null
      }),
      
      // Testing/mock action to add funds
      addFunds: async (amount) => {
        try {
          const { userId, zAddress, wallet } = get();
          if (!userId || !zAddress || !wallet) {
            throw new Error('Wallet not initialized');
          }
          
          set({ isConnecting: true, errorMessage: null });
          
          // Add funds to wallet (this is just for testing)
          await window.zcashService.addFunds(userId, zAddress, amount * 100000000);
          
          // Refresh balance
          await get().refreshBalance();
          
          set({ isConnecting: false });
        } catch (error) {
          console.error('Error adding funds:', error);
          set({ 
            isConnecting: false, 
            errorMessage: error instanceof Error ? error.message : 'Unknown error adding funds' 
          });
        }
      }
    }),
    {
      name: 'zec-escrow-storage',
      // Only persist certain fields
      partialize: (state) => ({
        userId: state.userId,
        zAddress: state.zAddress,
        isClient: state.isClient
      })
    }
  )
);

export default useStore; 