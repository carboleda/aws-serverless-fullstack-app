import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import { Button } from "@heroui/react";
import { useContext } from "react";

export const Header = () => {
  const context = useContext(TransactionContext);

  const handleNewTransaction = () => {
    context?.dialogState.open();
  };

  return (
    <div className="flex items-center justify-between py-4">
      <h1 className="text-2xl font-bold">Transactions</h1>
      {/* Add any additional header content or actions here */}
      <div className="">
        {/* Example: Add a button to create a new transaction */}
        <Button variant="primary" size="md" onPress={handleNewTransaction}>
          + New Transaction
        </Button>
      </div>
    </div>
  );
};
