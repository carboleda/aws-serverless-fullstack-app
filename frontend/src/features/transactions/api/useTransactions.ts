import {
  TransactionType,
  type Transaction,
} from "@/features/transactions/types/Tranaction";

export const useTransactions = () => {
  // Placeholder for fetching transactions data
  // You can replace this with actual API calls or state management logic
  const transactions: Transaction[] = [
    {
      id: "uuid-1",
      description: "Salary",
      amount: 5000,
      category: "Income",
      type: TransactionType.INCOME,
      sourceAccount: "Bank Account",
      createdAt: "2023-10-01",
    },
    {
      id: "uuid-2",
      description: "Groceries",
      amount: 150,
      category: "Food",
      type: TransactionType.EXPENSE,
      sourceAccount: "Credit Card",
      createdAt: "2023-10-02",
    },
    {
      id: "uuid-3",
      description: "Rent",
      amount: 1200,
      category: "Housing",
      type: TransactionType.EXPENSE,
      sourceAccount: "Bank Account",
      createdAt: "2023-10-03",
    },
  ];

  return {
    transactions,
  };
};
