import { TransactionType } from "@/modules/transactions/domain/models/transaction.model";

export interface CreateTransactionInputDto {
  userId: string;
  description: string;
  type: TransactionType;
  category?: string;
  sourceAccount: string;
  amount: number;
  createdAt: string;
}
