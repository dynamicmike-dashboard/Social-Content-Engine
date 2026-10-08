import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { BusinessProfile } from './components/BusinessProfile';
import { StrategyOverview } from './components/StrategyOverview';
import { Approvals } from './components/Approvals';
import { LoginPage } from './components/LoginPage';
import { DemoBanner } from './components/DemoBanner';
import { SalesIntro } from './components/SalesIntro';
import { OnboardingFlow } from './components/OnboardingFlow';

function AppContent() {
  const { isAuthenticated, isLoading, isDemoMode, membership } = useAuth();
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [showIntro, setShowIntro] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if intro has been completed before (from localStorage)
  useEffect(() => {
    const completed = localStorage.getItem('salesIntroCompleted');
    if (!completed && !isDemoMode && !isAuthenticated) {
      setShowIntro(true);
    }
  }, [isAuthenticated, isDemoMode]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('salesIntroCompleted', 'true');
  };

  const handleIntroSkip = () => {
    setShowIntro(false);
  };

  // Check if user needs onboarding (first time user)
  useEffect(() => {
    if (isAuthenticated && !isDemoMode) {
      const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [isAuthenticated, isDemoMode]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingCompleted', 'true');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Show Sales Intro for new visitors
  if (showIntro && !isAuthenticated && !isDemoMode) {
    return (
      <SalesIntro onComplete={handleIntroComplete} onSkip={handleIntroSkip} />
    );
  }

  // Show login page if not authenticated and not in demo mode
  if (!isAuthenticated && !isDemoMode) {
    return <LoginPage onLogin={() => {}} />;
  }

  // Show onboarding flow for new authenticated users
  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={handleOnboardingComplete} 
        demoMode={isDemoMode} 
      />
    );
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
      default:
        return <div className="text-2xl">{currentPage} Content</div>;
    }
  };

  return (
    <>
      {isDemoMode && <DemoBanner />}
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