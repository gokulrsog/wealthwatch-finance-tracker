import React, { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  CreditCard, 
  Target, 
  PiggyBank, 
  Settings,
  Menu,
  X,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'budgets', label: 'Budgets', icon: PiggyBank },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'insights', label: 'Insights', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Navigation = React.memo<NavigationProps>(({ activeSection, onSectionChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex bg-white border-r border-neutral-200 w-64 flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-600 to-accent-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">WealthWatch</h1>
              <p className="text-sm text-neutral-500">Financial Intelligence</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 px-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleSectionChange(item.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl font-medium transition-all duration-200",
                      isActive 
                        ? "bg-accent-50 text-accent-600 shadow-soft" 
                        : "text-neutral-600 hover:text-accent-600 hover:bg-accent-50/50"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive && "text-accent-600")} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="p-4 border-t border-neutral-100">
          <div className="bg-gradient-to-r from-accent-50 to-accent-100/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-accent-800 mb-1">Pro Tip</h3>
            <p className="text-xs text-accent-700">
              Set up automatic categorization to save time on transaction entry.
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-600 to-accent-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-neutral-900">WealthWatch</h1>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute top-0 right-0 h-full w-80 max-w-full bg-white shadow-soft-lg animate-slide-down">
              <div className="p-4 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent-600 to-accent-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-lg font-bold text-neutral-900">WealthWatch</h1>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <ul className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleSectionChange(item.id)}
                          className={cn(
                            "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl font-medium transition-all duration-200",
                            isActive 
                              ? "bg-accent-50 text-accent-600 shadow-soft" 
                              : "text-neutral-600 hover:text-accent-600 hover:bg-accent-50/50"
                          )}
                        >
                          <Icon className={cn("h-5 w-5", isActive && "text-accent-600")} />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

Navigation.displayName = 'Navigation';