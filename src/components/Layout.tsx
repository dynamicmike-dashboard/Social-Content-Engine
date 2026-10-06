import React from 'react';
import { LayoutDashboard, Calendar, FileText, Target, Building2, CheckCircle2 } from 'lucide-react';
import { Footer } from './Footer';

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

export const Layout = ({ children, currentPage, setCurrentPage }: { 
  children: React.ReactNode, 
  currentPage: string,
  setCurrentPage: (page: string) => void
}) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2D2D] font-sans flex">
      <nav className="w-64 border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-10 tracking-tight text-[#7FB3D5]">Content Engine</h1>
        <div className="space-y-4">
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
        <Footer />
      </nav>
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
};
