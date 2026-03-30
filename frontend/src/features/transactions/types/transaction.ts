export const TransactionTypes = {
  INCOME: "income",
  EXPENSE: "expense",
};

export type TransactionType =
  (typeof TransactionTypes)[keyof typeof TransactionTypes];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  sourceAccount: string;
  createdAt: Date;
}

export interface TransactionDto extends Omit<Transaction, "id" | "createdAt"> {
  id?: string;
  createdAt: string;
}
