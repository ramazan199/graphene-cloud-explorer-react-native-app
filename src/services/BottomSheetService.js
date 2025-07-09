import { createContext, useContext } from 'react';

const BottomSheetContext = createContext(null);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};

export const BottomSheetProvider = BottomSheetContext.Provider; 