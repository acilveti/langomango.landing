import React, { Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

interface ReaderDemoModalContextProps {
  isReaderDemoModalOpened: boolean;
  setIsReaderDemoModalOpened: Dispatch<SetStateAction<boolean>>;
}

export const ReaderDemoModalContext = React.createContext<ReaderDemoModalContextProps | null>(null);

export function ReaderDemoModalContextProvider<T>({ children }: PropsWithChildren<T>) {
  const [isReaderDemoModalOpened, setIsReaderDemoModalOpened] = useState(false);

  return (
    <ReaderDemoModalContext.Provider
      value={{
        isReaderDemoModalOpened,
        setIsReaderDemoModalOpened,
      }}
    >
      {children}
    </ReaderDemoModalContext.Provider>
  );
}

export function useReaderDemoModalContext() {
  const context = useContext(ReaderDemoModalContext);
  if (!context) {
    throw new Error('useReaderDemoModalContext can only be used inside useReaderDemoModalContextProvider');
  }
  return context;
}
