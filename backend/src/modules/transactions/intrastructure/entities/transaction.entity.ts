import { TransactionType } from "@/modules/transactions/domain/models/transaction.model";

export interface TransactionEntity {
  userId: string;
  id?: string | null;
  description: string;
  type: TransactionType;
  category?: string | null;
  sourceAccount: string;
  amount: number;
  createdAt: number; // Unix timestamp in milliseconds
}
