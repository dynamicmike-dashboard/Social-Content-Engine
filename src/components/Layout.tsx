import React from 'react';
import { LayoutDashboard, Calendar, FileText, Target, Building2, CheckCircle2, LogOut, Briefcase } from 'lucide-react';
import { Footer } from './Footer';
import { useAuth } from '../hooks/useAuth';

interface NavItem {
  name: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Calendar', icon: Calendar },
  { name: 'Content', icon: FileText },
  { name: 'Strategy', icon: Target },
  { name: 'Business Profile', icon: Building2 },
  { name: 'Approvals', icon: CheckCircle2 },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user?: { clientName?: string; clientId?: string; role?: string } | null;
}

export const Layout = ({ children, currentPage, setCurrentPage, user }: LayoutProps) => {
  const { logout, isDemoMode, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2D2D] font-sans flex">
      <nav className="w-64 border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-xl font-bold mb-2 tracking-tight text-[#7FB3D5]">Content Engine</h1>
          {isDemoMode && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
              Demo Mode
            </span>
          )}
        </div>
        
        <div className="space-y-4 mb-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setCurrentPage(item.name)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                currentPage === item.name ? 'bg-[#A3E4D7] text-white' : 'hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </button>
          ))}
        </div>

        {isAuthenticated && user && (
          <div className="flex-1 flex flex-col justify-end">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Briefcase size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.clientName}</p>
                  <p className="text-xs text-gray-500">{user.clientId}</p>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        )}

        {!isAuthenticated && !isDemoMode && (
          <div className="flex-1 flex flex-col justify-end">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4 text-center">
              <p className="text-sm text-gray-500">Not signed in</p>
            </div>
          </div>
        )}

        <Footer />
      </nav>
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
};