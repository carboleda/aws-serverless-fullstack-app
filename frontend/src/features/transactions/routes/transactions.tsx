import { useTransactions } from "@/features/transactions/api/useTransactions";
import { Header } from "@/features/transactions/components/Header";
import { TransactionsTable } from "@/features/transactions/components/TransactionsTable";

export const Transactions = () => {
  const { transactions } = useTransactions();

  return (
    <div className="w-full overflow-hidden">
      <Header />
      <TransactionsTable transactions={transactions} />
    </div>
  );
};
