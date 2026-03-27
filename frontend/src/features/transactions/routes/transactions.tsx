import { useGetTransactions } from "@/features/transactions/api/useGetTransactions";
import { Header } from "@/features/transactions/components/Header";
import { TranactionDialog } from "@/features/transactions/components/TransactionDialog";
import { TransactionsTable } from "@/features/transactions/components/TransactionsTable";
import { TransactionProvider } from "@/features/transactions/context/TransactionContext";
import { Spinner } from "@heroui/react";
import { DeleteTransactionDialog } from "@/features/transactions/components/DeleteTransactionDialog";

export const Transactions = () => {
  const {
    data: transactions = [],
    isLoading,
    isFetching,
    error,
  } = useGetTransactions();

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Spinner color="accent" />
        <span className="text-xs text-muted">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div>Error loading transactions</div>;
  }

  return (
    <div className="w-full overflow-hidden">
      <TransactionProvider>
        <Header />
        <TransactionsTable transactions={transactions} />
        <TranactionDialog />
        <DeleteTransactionDialog />
      </TransactionProvider>
    </div>
  );
};
