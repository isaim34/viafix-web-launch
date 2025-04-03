
import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <NavLink 
        to="/"
        className={({ isActive }) => `text-sm font-medium transition-colors ${
          isActive ? 'text-primary' : 'text-foreground hover:text-primary'
        }`}
      >
        Home
      </NavLink>
      <NavLink 
        to="/mechanics"
        className={({ isActive }) => `text-sm font-medium transition-colors ${
          isActive ? 'text-primary' : 'text-foreground hover:text-primary'
        }`}
      >
        Mechanics
      </NavLink>
      <NavLink 
        to="/how-it-works"
        className={({ isActive }) => `text-sm font-medium transition-colors ${
          isActive ? 'text-primary' : 'text-foreground hover:text-primary'
        }`}
      >
        How It Works
      </NavLink>
    </nav>
  );
};
