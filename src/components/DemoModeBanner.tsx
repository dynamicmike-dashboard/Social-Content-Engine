import React from 'react';
import { useSession } from '../context/SessionContext';

export const DemoModeBanner = () => {
  const { mode } = useSession();
  
  if (mode !== 'DEMO') return null;

  return (
    <div className="bg-amber-100 text-amber-800 text-center py-2 text-xs font-bold border-b border-amber-200">
      DEMO MODE: Illustrative Data Only
    </div>
  );
};
