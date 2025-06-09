import { useState } from 'react';
import {
  FileText,
  UploadCloud,
  BarChart2,
  MessageCircle
} from 'lucide-react';

interface SidebarProps {
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ onTabChange }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState('problem');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const sidebarTabs = [
    { id: 'problem', label: 'Problem', icon: FileText },
    { id: 'submissions', label: 'Submissions', icon: UploadCloud },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart2 },
    { id: 'discussions', label: 'Discussions', icon: MessageCircle }
  ];

  return (
    <div className="w-14 bg-white border-r border-gray-200 flex flex-col items-center h-full py-4 gap-6">
      {sidebarTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`relative h-32 w-8 flex items-center justify-center transition-all duration-200
              ${activeTab === tab.id ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {activeTab === tab.id && (
              <span className="absolute left-0 top-0 h-full w-1 bg-red-500" />
            )}
            <div className="flex items-center gap-1 transform -rotate-90">
              <Icon size={16} className="shrink-0" />
              <span className="text-sm font-semibold whitespace-nowrap">
                {tab.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;

/*
import { useState } from 'react';

interface SidebarProps {
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ onTabChange }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState('problem');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const sidebarTabs = [
    { id: 'problem', label: 'Problem' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'discussions', label: 'Discussions' }
  ];

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col h-full">
      {sidebarTabs.map((tab) => (
        <button
          key={tab.id}
          className={`
            w-full 
            px-4 
            py-3 
            text-left 
            text-sm 
            font-medium 
            transition-all 
            duration-200 
            ease-in-out
            relative
            ${activeTab === tab.id 
              ? 'text-red-500 bg-red-50' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-red-500'}
          `}
          onClick={() => handleTabClick(tab.id)}
        >
          {activeTab === tab.id && (
            <span 
              className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
*/