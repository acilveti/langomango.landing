import React, { Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

interface LanguageSelectorModalContextProps {
  isLanguageSelectorModalOpened: boolean;
  setIsLanguageSelectorModalOpened: Dispatch<SetStateAction<boolean>>;
}

export const LanguageSelectorModalContext = React.createContext<LanguageSelectorModalContextProps | null>(null);

export function LanguageSelectorModalContextProvider<T>({ children }: PropsWithChildren<T>) {
  const [isLanguageSelectorModalOpened, setIsLanguageSelectorModalOpened] = useState(false);

  return (
    <LanguageSelectorModalContext.Provider
      value={{
        isLanguageSelectorModalOpened,
        setIsLanguageSelectorModalOpened,
      }}
    >
      {children}
    </LanguageSelectorModalContext.Provider>
  );
}

export function useLanguageSelectorModalContext() {
  const context = useContext(LanguageSelectorModalContext);
  if (!context) {
    throw new Error('useLanguageSelectorModalContext can only be used inside useLanguageSelectorModalContextProvider');
  }
  return context;
}
