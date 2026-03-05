import React, { createContext, useContext } from 'react';
import { getTranslation } from './translations';

const TranslationContext = createContext();

export const TranslationProvider = ({ children, language }) => {
  const t = (key) => getTranslation(language, key);
  
  return (
    <TranslationContext.Provider value={{ t, language }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};