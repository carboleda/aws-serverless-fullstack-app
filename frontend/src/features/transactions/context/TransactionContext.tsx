import { useOverlayState, type UseOverlayStateReturn } from "@heroui/react";
import { createContext, useState } from "react";
import type { Transaction } from "@/features/transactions/types/Tranaction";

interface TransactionContextValue {
  dialogState: UseOverlayStateReturn;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (transaction: Transaction | null) => void;
}

const TransactionContext = createContext<TransactionContextValue | undefined>(
  undefined,
);

const TransactionProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const dialogState = useOverlayState();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  return (
    <TransactionContext.Provider
      value={{ dialogState, selectedTransaction, setSelectedTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContext, TransactionProvider };
