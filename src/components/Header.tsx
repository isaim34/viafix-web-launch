
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './header/Logo';
import { Navigation } from './header/Navigation';
import { AuthButtons } from './header/AuthButtons';
import { MobileMenu } from './header/MobileMenu';
import { useHeader } from '@/hooks/useHeader';

export const Header = () => {
  const { isScrolled, isMobileMenuOpen, setIsMobileMenuOpen } = useHeader();

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <Navigation />

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} />
    </header>
  );
};
