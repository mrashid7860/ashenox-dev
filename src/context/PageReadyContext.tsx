'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface PageReadyContextType {
  pageReady: boolean;
  setPageReady: (ready: boolean) => void;
}

const PageReadyContext = createContext<PageReadyContextType | null>(null);

export function PageReadyProvider({ children }: { children: ReactNode }) {
  const [pageReady, setPageReady] = useState(false);

  return (
    <PageReadyContext.Provider
      value={{
        pageReady,
        setPageReady,
      }}
    >
      {children}
    </PageReadyContext.Provider>
  );
}

export function usePageReady() {
  const context = useContext(PageReadyContext);

  if (!context) {
    throw new Error('usePageReady must be used inside PageReadyProvider');
  }

  return context;
}
