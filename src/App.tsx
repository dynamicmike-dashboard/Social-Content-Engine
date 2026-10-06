import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { BusinessProfile } from './components/BusinessProfile';
import { StrategyOverview } from './components/StrategyOverview';
import { Approvals } from './components/Approvals';
import { IntroExperience } from './components/IntroExperience';
import { SessionProvider } from './context/SessionContext';
import { DemoModeBanner } from './components/DemoModeBanner';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentPage, setCurrentPage] = useState('Dashboard');

  if (showIntro) {
    return <IntroExperience onStartDemo={() => setShowIntro(false)} onSeeContent={() => setShowIntro(false)} />;
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
    <SessionProvider>
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        <DemoModeBanner />
        {renderPage()}
      </Layout>
    </SessionProvider>
  );
}
