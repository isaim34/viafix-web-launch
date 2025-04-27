
import React from 'react';

interface AuthTabsProps {
  isNewAccount: boolean;
  onTabChange: (isNew: boolean) => void;
}

export const AuthTabs = ({ isNewAccount, onTabChange }: AuthTabsProps) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
      <button 
        type="button" 
        className={`flex-1 py-2 text-center rounded-md transition-all ${!isNewAccount ? 'bg-white shadow' : ''}`}
        onClick={() => onTabChange(false)}
      >
        Sign In
      </button>
      <button 
        type="button" 
        className={`flex-1 py-2 text-center rounded-md transition-all ${isNewAccount ? 'bg-white shadow' : ''}`}
        onClick={() => onTabChange(true)}
      >
        Register
      </button>
    </div>
  );
};
