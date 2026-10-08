import { createContext, useContext, useState, type ReactNode } from 'react';

type AppMode = 'DEMO' | 'CLIENT';

interface SessionContextType {
  mode: AppMode;
  clientId: string | null;
  setMode: (mode: AppMode) => void;
  setClientId: (id: string | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<AppMode>('DEMO');
  const [clientId, setClientId] = useState<string | null>(null);

  return (
    <SessionContext.Provider value={{ mode, clientId, setMode, setClientId }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within a SessionProvider');
  return context;
};
