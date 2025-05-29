
import React, { useState } from 'react';
import { Logo } from './header/Logo';
import { Navigation } from './header/Navigation';
import { AuthButtons } from './header/AuthButtons';
import { UserGreeting } from './header/UserGreeting';
import { MobileMenu } from './header/MobileMenu';
import { SmartReminders } from './notifications/SmartReminders';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Logo />
          <Navigation />
          <div className="flex items-center gap-4">
            {user ? <UserGreeting /> : <AuthButtons />}
            <MobileMenu 
              isOpen={isMobileMenuOpen} 
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
          </div>
        </div>
      </header>
      
      {/* Smart Reminders - shown below header when user is logged in */}
      {user && (
        <div className="border-b bg-blue-50/50">
          <div className="container mx-auto px-4 sm:px-6 py-2">
            <SmartReminders />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
