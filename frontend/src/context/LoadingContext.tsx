import React, { createContext, ReactNode, useContext, useState } from "react";

// Define context type
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Create Context
export const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setLoading: () =>  {}
});

// Provider Component
export const LoadingProvider = ({ children }: {children: ReactNode}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
