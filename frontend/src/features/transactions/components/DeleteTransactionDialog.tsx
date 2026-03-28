import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { useDeleteTransaction } from "@/features/transactions/api/useDeleteTransaction";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import { useContext } from "react";

export const DeleteTransactionDialog = () => {
  const context = useContext(TransactionContext);
  const { mutate: deleteTransaction } = useDeleteTransaction();

  const handleConfirm = () => {
    if (!context?.transactionToDelete) return;
    deleteTransaction(context.transactionToDelete.id, {
      onSuccess: () => context.setTransactionToDelete(null),
    });
  };

  return (
    <ConfirmationDialog
      title="Delete Transaction"
      description={
        context?.transactionToDelete
          ? `Are you sure you want to delete "${context.transactionToDelete.description}"? This action cannot be undone.`
          : ""
      }
      triggerText="Delete"
      onConfirm={handleConfirm}
      isOpen={context?.deleteDialogState.isOpen}
      onOpenChange={context?.deleteDialogState.setOpen}
    />
  );
};
