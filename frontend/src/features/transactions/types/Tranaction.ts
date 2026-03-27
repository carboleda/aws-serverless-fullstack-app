export const TransactionType = {
  INCOME: "income",
  EXPENSE: "expense",
};

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: (typeof TransactionType)[keyof typeof TransactionType];
  sourceAccount: string;
  createdAt: Date;
}

export interface TransactionDto extends Omit<Transaction, "createdAt"> {
  createdAt: string;
}
