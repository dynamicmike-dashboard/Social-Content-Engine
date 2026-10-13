import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { BusinessProfile } from './components/BusinessProfile';
import { StrategyOverview } from './components/StrategyOverview';
import { Approvals } from './components/Approvals';
import { SignUpPage } from './components/SignUpPage';
import { VerifyEmailPage } from './components/VerifyEmailPage';
import { SalesIntro } from './components/SalesIntro';
import { PromptLibrary } from './components/PromptLibrary';
import { SalesPage } from './components/SalesPage';

function AppContent() {
  const { isAuthenticated, isLoading, membership } = useAuth();
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [showIntro, setShowIntro] = useState(false);

  // Check if intro has been completed before (from localStorage)
  useEffect(() => {
    const completed = localStorage.getItem('salesIntroCompleted');
    if (!completed && !isAuthenticated) {
      setShowIntro(true);
    }
  }, [isAuthenticated]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('salesIntroCompleted', 'true');
  };

  const handleIntroSkip = () => {
    setShowIntro(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Show Sales Intro for new visitors
  if (showIntro && !isAuthenticated) {
    return (
      <SalesIntro onComplete={handleIntroComplete} onSkip={handleIntroSkip} />
    );
  }

  // Show auth pages for unauthenticated users
  if (!isAuthenticated) {
    const path = window.location.pathname;
    if (path === '/auth/sign-up') {
      return <SignUpPage />;
    }
    if (path === '/auth/verify-email') {
      return <VerifyEmailPage />;
    }
    return <SalesPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Calendar':
        return <CalendarView />;
      case 'Business Profile':
        return <BusinessProfile onGenerate={() => setCurrentPage('Strategy')} />;
      case 'Strategy':
        return <StrategyOverview onGenerate={() => setCurrentPage('Calendar')} />;
      case 'Approvals':
        return <Approvals />;
      case 'Prompt Library':
        return <PromptLibrary />;
      default:
        return <div className="text-2xl">{currentPage} Content</div>;
    }
  };

  return (
    <>
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage} user={membership}>
        {renderPage()}
      </Layout>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}