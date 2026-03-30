import { useOverlayState, type UseOverlayStateReturn } from "@heroui/react";
import { createContext, useState } from "react";
import type { Transaction } from "@/features/transactions/types/transaction";

interface TransactionContextValue {
  dialogState: UseOverlayStateReturn;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  deleteDialogState: UseOverlayStateReturn;
  transactionToDelete: Transaction | null;
  setTransactionToDelete: (transaction: Transaction | null) => void;
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

  const deleteDialogState = useOverlayState();
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  return (
    <TransactionContext.Provider
      value={{
        dialogState,
        selectedTransaction,
        setSelectedTransaction,
        deleteDialogState,
        transactionToDelete,
        setTransactionToDelete,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContext, TransactionProvider };
