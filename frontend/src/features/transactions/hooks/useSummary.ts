import {
  TransactionTypes,
  type Transaction,
} from "@/features/transactions/types/transaction";

interface SummaryProps {
  transactions: Transaction[];
}

export const useSummary = ({ transactions }: SummaryProps) => {
  const { totalIncome, totalExpense } = transactions.reduce(
    (acc, { type, amount }) => {
      if (type === TransactionTypes.INCOME) {
        return { ...acc, totalIncome: acc.totalIncome + amount };
      }

      if (type === TransactionTypes.EXPENSE) {
        return { ...acc, totalExpense: acc.totalExpense + amount };
      }

      return acc;
    },
    { totalIncome: 0, totalExpense: 0 },
  );

  const netTotal = totalIncome - totalExpense;
  const netChangePercent =
    totalIncome > 0 ? (netTotal / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpense,
    netTotal,
    netChangePercent,
  };
};
