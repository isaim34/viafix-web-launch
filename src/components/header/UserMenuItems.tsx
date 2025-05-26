
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  User,
  LogOut,
  Settings,
  MessageSquare,
  Calendar,
  Gauge,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const UserMenuItems = () => {
  const navigate = useNavigate();
  const { currentUserRole, signOut } = useAuth();
  const isMechanic = currentUserRole === 'mechanic';
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <DropdownMenuItem onSelect={() => navigate(isMechanic ? '/mechanic-dashboard/profile' : '/profile')}>
        <User className="mr-2 h-4 w-4" />
        <span>My Profile</span>
      </DropdownMenuItem>
      
      {isMechanic && (
        <>
          <DropdownMenuItem onSelect={() => navigate('/mechanic-dashboard')}>
            <Gauge className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onSelect={() => navigate('/mechanic-dashboard/calendar')}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onSelect={() => navigate('/mechanic-dashboard/advertising')}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Advertising & Promotion</span>
          </DropdownMenuItem>
        </>
      )}
      
      <DropdownMenuItem onSelect={() => navigate('/messages')}>
        <MessageSquare className="mr-2 h-4 w-4" />
        <span>Messages</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onSelect={() => navigate('/account-settings')}>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onSelect={() => navigate('/help')}>
        <AlertCircle className="mr-2 h-4 w-4" />
        <span>Help & Support</span>
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem onSelect={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sign out</span>
      </DropdownMenuItem>
    </>
  );
};
