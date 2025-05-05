
import { useAuth } from '@/hooks/useAuth';

interface UserGreetingProps {
  isMobile?: boolean;
}

export const UserGreeting = ({ isMobile = false }: UserGreetingProps) => {
  const { currentUserName, getFirstName } = useAuth();
  
  const firstName = getFirstName(currentUserName);

  return (
    <div className={isMobile ? "px-4 py-2" : ""}>
      <p className="font-medium">
        Welcome, {firstName || 'User'}!
      </p>
    </div>
  );
};
