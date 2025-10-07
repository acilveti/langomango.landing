import React, { Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

interface SignupModalContextProps {
  isModalOpened: boolean;
  setIsModalOpened: Dispatch<SetStateAction<boolean>>;
}

export const SignupModalContext = React.createContext<SignupModalContextProps | null>(null);

export function SignupModalContextProvider<T>({ children }: PropsWithChildren<T>) {
  const [isModalOpened, setIsModalOpened] = useState(false);

  return (
    <SignupModalContext.Provider
      value={{
        isModalOpened,
        setIsModalOpened,
      }}
    >
      {children}
    </SignupModalContext.Provider>
  );
}

export function useSignupModalContext() {
  const context = useContext(SignupModalContext);
  if (!context) {
    throw new Error('useSignupModalContext can only be used inside useSignupModalContextProvider');
  }
  return context;
}
