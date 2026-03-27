import { useOverlayState, type UseOverlayStateReturn } from "@heroui/react";
import { createContext } from "react";

interface TransactionContextValue {
  dialogState: UseOverlayStateReturn;
}

const TransactionContext = createContext<TransactionContextValue | undefined>(
  undefined,
);

const TransactionProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const dialogState = useOverlayState();

  return (
    <TransactionContext.Provider value={{ dialogState }}>
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContext, TransactionProvider };
