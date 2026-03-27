import { TransactionType } from "@/modules/transactions/domain/models/transaction.model";

export interface TransactionDto {
  id: string;
  description: string;
  type: TransactionType;
  category?: string | null;
  sourceAccount: string;
  amount: number;
  createdAt: string;
}
