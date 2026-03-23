import {
  TransactionStatus,
  TransactionType,
} from "@/modules/transactions/domain/models/transaction.model";

export interface CreateTransactionInputDto {
  userId: string;
  description: string;
  paymentLink?: string | null;
  notes?: string | null;
  type: TransactionType;
  status: TransactionStatus;
  category?: string;
  sourceAccount: string;
  destinationAccount?: string;
  amount: number;
  createdAt: string;
  isRecurrent?: boolean;
}
