import { create } from 'zustand'

interface Deal {
  id: string
  job: string
  amount: number
  senderZAddress: string
  recipientZAddress: string
  releaseDate: string
  status: 'locked' | 'work_submitted' | 'under_challenge' | 'completed' | 'refunded'
  progress: number
  timestamp: string
  proof?: string
  notes?: string
}

interface StoreState {
  zAddress: string | null
  senderZAddress: string | null
  recipientZAddress: string | null
  role: 'client' | 'freelancer' | null
  deals: Deal[]
  balance: number
  
  // Modal states
  isCreateDealOpen: boolean
  isSubmitWorkOpen: boolean
  isReviewWorkOpen: boolean
  currentDealId: string | null
  
  // Actions
  setZAddress: (address: string) => void
  addDeal: (deal: Omit<Deal, 'id' | 'status' | 'progress' | 'timestamp'>) => void
  submitWork: (id: string, proof: string, notes: string) => void
  approveWork: (id: string) => void
  challengeDeal: (id: string) => void
  
  // Modal actions
  openCreateDealModal: () => void
  closeCreateDealModal: () => void
  openSubmitWorkModal: (dealId: string) => void
  closeSubmitWorkModal: () => void
  openReviewWorkModal: (dealId: string) => void
  closeReviewWorkModal: () => void
}

type DealStatus = Deal['status']

export const useStore = create<StoreState>((set) => ({
  zAddress: null,
  senderZAddress: null,
  recipientZAddress: null,
  role: null,
  deals: [],
  balance: 1.0, // Mock balance
  
  // Modal states
  isCreateDealOpen: false,
  isSubmitWorkOpen: false,
  isReviewWorkOpen: false,
  currentDealId: null,
  
  // Actions
  setZAddress: (address) => set({ 
    zAddress: address,
    senderZAddress: address 
  }),
  
  addDeal: (deal) => set((state) => ({
    deals: [...state.deals, {
      ...deal,
      id: `ZSC${String(state.deals.length + 1).padStart(3, '0')}`,
      status: 'locked' as DealStatus,
      progress: 20,
      timestamp: new Date().toISOString()
    }],
    isCreateDealOpen: false
  })),
  
  submitWork: (id, proof, notes) => set((state) => ({
    deals: state.deals.map(deal =>
      deal.id === id 
        ? { ...deal, status: 'work_submitted' as DealStatus, progress: 60, proof, notes } 
        : deal
    ),
    isSubmitWorkOpen: false
  })),
  
  approveWork: (id) => set((state) => ({
    deals: state.deals.map(deal =>
      deal.id === id ? { ...deal, status: 'completed' as DealStatus, progress: 100 } : deal
    ),
    isReviewWorkOpen: false
  })),
  
  challengeDeal: (id) => set((state) => {
    // Mark as under challenge
    const updatedDeals = state.deals.map(deal =>
      deal.id === id ? { ...deal, status: 'under_challenge' as DealStatus, progress: 80 } : deal
    );
    
    // After 3 seconds (simulating dispute resolution), mark as refunded
    setTimeout(() => {
      set((state) => ({
        deals: state.deals.map(deal =>
          deal.id === id ? { ...deal, status: 'refunded' as DealStatus, progress: 100 } : deal
        )
      }));
    }, 3000);
    
    return { 
      deals: updatedDeals,
      isReviewWorkOpen: false
    };
  }),
  
  // Modal actions
  openCreateDealModal: () => set({ isCreateDealOpen: true }),
  closeCreateDealModal: () => set({ isCreateDealOpen: false }),
  
  openSubmitWorkModal: (dealId) => set({ 
    isSubmitWorkOpen: true,
    currentDealId: dealId
  }),
  closeSubmitWorkModal: () => set({ 
    isSubmitWorkOpen: false,
    currentDealId: null
  }),
  
  openReviewWorkModal: (dealId) => set({ 
    isReviewWorkOpen: true,
    currentDealId: dealId
  }),
  closeReviewWorkModal: () => set({ 
    isReviewWorkOpen: false,
    currentDealId: null
  })
}))
