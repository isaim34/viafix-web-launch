
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface MessageBalance {
  available: number;
  used: number;
  total: number;
  loading: boolean;
  error: string | null;
}

export const useMessageBalance = () => {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState<MessageBalance>({
    available: 0,
    used: 0,
    total: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchMessageBalance = async () => {
      if (!currentUser) {
        setBalance(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        // TODO: Replace with actual API call to fetch user's message balance
        // For now, simulate fetching from localStorage or use mock data
        const mockBalance = {
          available: 50, // This should come from successful Stripe purchase
          used: 0,
          total: 50,
          loading: false,
          error: null
        };
        
        setBalance(mockBalance);
      } catch (error) {
        console.error('Error fetching message balance:', error);
        setBalance(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load message balance'
        }));
      }
    };

    fetchMessageBalance();
  }, [currentUser]);

  const deductMessages = (count: number) => {
    setBalance(prev => ({
      ...prev,
      available: Math.max(0, prev.available - count),
      used: prev.used + count
    }));
  };

  const addMessages = (count: number) => {
    setBalance(prev => ({
      ...prev,
      available: prev.available + count,
      total: prev.total + count
    }));
  };

  return {
    balance,
    deductMessages,
    addMessages,
    refreshBalance: () => {
      // Re-fetch balance if needed
      setBalance(prev => ({ ...prev, loading: true }));
    }
  };
};
