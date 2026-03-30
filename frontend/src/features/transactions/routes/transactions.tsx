import { useGetTransactions } from "@/features/transactions/api/useGetTransactions";
import { Header } from "@/features/transactions/components/Header";
import { TranactionDialog } from "@/features/transactions/components/TransactionDialog";
import { TransactionsTable } from "@/features/transactions/components/TransactionsTable";
import { TransactionProvider } from "@/features/transactions/context/TransactionContext";
import { DeleteTransactionDialog } from "@/features/transactions/components/DeleteTransactionDialog";

export const Transactions = () => {
  const {
    data: transactions = [],
    isLoading,
    isFetching,
    error,
  } = useGetTransactions();

  return (
    <TransactionProvider>
      <div className="w-full overflow-hidden flex flex-col gap-2">
        <Header transactions={transactions} />
        <TransactionsTable
          transactions={transactions}
          loadingError={error}
          isLoading={isLoading}
          isFetching={isFetching}
        />
        <TranactionDialog />
        <DeleteTransactionDialog />
      </div>
    </TransactionProvider>
  );
};
