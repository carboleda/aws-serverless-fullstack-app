import { Button } from "@heroui/react";

export const Header = () => {
  return (
    <div className="flex items-center justify-between py-4">
      <h1 className="text-2xl font-bold">Transactions</h1>
      {/* Add any additional header content or actions here */}
      <div className="">
        {/* Example: Add a button to create a new transaction */}
        <Button variant="primary" size="md">
          + New Transaction
        </Button>
      </div>
    </div>
  );
};
