
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench, 
  CheckSquare, 
  Calendar, 
  MessageCircle, 
  Tags, 
  BarChart3, 
  Settings, 
  X,
  Star,
  Database,
  FileText
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const tabGroups = [
  [
    { value: "gigs", icon: Wrench, label: "My Gigs" },
    { value: "custom-offers", icon: FileText, label: "Custom Offers" },
    { value: "maintenance", icon: Database, label: "Maintenance" },
    { value: "completed-jobs", icon: CheckSquare, label: "Completed" },
    { value: "cancelled", icon: X, label: "Cancelled" },
  ],
  [
    { value: "planner", icon: Calendar, label: "Planner" },
    { value: "messages", icon: MessageCircle, label: "Messages" },
  ],
  [
    { value: "advertising", icon: Tags, label: "Advertising" },
    { value: "stats", icon: BarChart3, label: "Statistics" },
    { value: "reviews", icon: Star, label: "Reviews" },
  ],
  [
    { value: "profile", icon: Settings, label: "Profile" },
    { value: "debug", icon: Database, label: "Debug" },
  ],
];

export const DashboardTabsList = () => {
  const isMobile = useIsMobile();

  return (
    <TabsList className="mb-6 md:mb-8 flex flex-wrap gap-2 md:gap-1 justify-start">
      {tabGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex flex-wrap gap-2 md:gap-1 w-full md:w-auto">
          {group.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]"
            >
              <tab.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className={isMobile ? "hidden xs:inline" : ""}>{tab.label}</span>
            </TabsTrigger>
          ))}
        </div>
      ))}
    </TabsList>
  );
};
