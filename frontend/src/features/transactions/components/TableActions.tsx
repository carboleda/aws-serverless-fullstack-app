import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import type { Transaction } from "@/features/transactions/types/transaction";
import { Button } from "@heroui/react";
import { useContext } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";

export const TableActions: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => {
  const context = useContext(TransactionContext);

  const handleEdit = () => {
    context?.setSelectedTransaction(transaction);
    context?.dialogState.open();
  };

  const handleDelete = () => {
    context?.setTransactionToDelete(transaction);
    context?.deleteDialogState.open();
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-1">
      <Button
        size="sm"
        variant="tertiary"
        aria-label="Edit transaction"
        onPress={() => handleEdit()}
      >
        <CiEdit className="size-4" />
      </Button>
      <Button
        size="sm"
        variant="danger-soft"
        aria-label="Delete transaction"
        onPress={() => handleDelete()}
      >
        <CiTrash className="size-4" />
      </Button>
    </div>
  );
};
