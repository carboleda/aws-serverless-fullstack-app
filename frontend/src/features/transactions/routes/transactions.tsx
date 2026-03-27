import { useGetTransactions } from "@/features/transactions/api/useGetTransactions";
import { Header } from "@/features/transactions/components/Header";
import { TransactionsTable } from "@/features/transactions/components/TransactionsTable";
import { Spinner } from "@heroui/react";

export const Transactions = () => {
  const { data: transactions = [], isLoading, error } = useGetTransactions();

  if (isLoading) {
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
      <Header />
      <TransactionsTable transactions={transactions} />
    </div>
  );
};
