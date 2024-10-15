import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, FileText, Settings, ChevronDown, ChevronRight, Palette } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isPageManagementOpen, setIsPageManagementOpen] = useState(true);
  const [page, setPage] = useState({
    title: '',
    color: 'linear-gradient(0deg, #000000, #000000)',
    fontSize: 16,
    content: '',
    featuredImage: '',
    sidebar: {
      enabled: false,
      content: '',
    },
  });

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/admin/page', label: 'All Pages' },
    { path: '/admin/page/drafts', label: 'Drafts' },
    { path: '/admin/page/published', label: 'Published' },
  ];

  return (
    <aside className="w-64 h-full bg-gray-100 dark:bg-gray-800 p-4 space-y-4 transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-bold mb-4">Pages</h2>
      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        <Link to="/admin/page/create">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Page
        </Link>
      </Button>
      <Separator className="my-4" />
      <nav className="space-y-2">
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-between"
            onClick={() => setIsPageManagementOpen(!isPageManagementOpen)}
          >
            <span className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Page Management
            </span>
            {isPageManagementOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          {isPageManagementOpen && (
            <div className="space-y-2 pl-4">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={`w-full justify-start ${isActive(item.path) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  asChild
                >
                  <Link to={item.path}>{item.label}</Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      
        <Button
          variant="ghost"
          className={`w-full justify-start ${isActive('/admin/page/settings') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
          asChild
        >
          <Link to="/admin/page/settings">
            <Settings className="mr-2 h-4 w-4" />
            Page Settings
          </Link>
        </Button>
      </nav>
      <Separator className="my-4" />
    </aside>
  );
};

export default Sidebar;
