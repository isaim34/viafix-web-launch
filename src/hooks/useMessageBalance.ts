
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
  const { user } = useAuth();
  const [balance, setBalance] = useState<MessageBalance>({
    available: 0,
    used: 0,
    total: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchMessageBalance = async () => {
      if (!user) {
        setBalance(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        // TODO: Replace with actual API call to fetch user's message balance
        // For production, this should fetch from the database
        // For now, we'll show zero balance to indicate no credits purchased yet
        const productionBalance = {
          available: 0,
          used: 0,
          total: 0,
          loading: false,
          error: null
        };
        
        setBalance(productionBalance);
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
  }, [user]);

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
