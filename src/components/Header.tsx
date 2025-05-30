
import React, { useState } from 'react';
import { Logo } from './header/Logo';
import { Navigation } from './header/Navigation';
import { AuthButtons } from './header/AuthButtons';
import { UserGreeting } from './header/UserGreeting';
import { MobileMenu } from './header/MobileMenu';
import { SmartReminders } from './notifications/SmartReminders';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
          <Logo />
          <Navigation />
          <div className="flex items-center gap-4">
            {/* Desktop Auth/User Menu */}
            <div className="hidden md:block">
              <AuthButtons />
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Smart Reminders - shown below header when user is logged in */}
      {user && (
        <div className="border-b bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 py-2">
            <SmartReminders />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
