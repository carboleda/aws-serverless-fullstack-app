import {
  TransactionStatus,
  TransactionType,
} from "@/modules/transactions/domain/models/transaction.model";

export interface TransactionEntity {
  userId: string;
  id?: string | null;
  description: string;
  paymentLink?: string | null;
  notes?: string | null;
  type: TransactionType;
  status: TransactionStatus;
  category?: string | null;
  sourceAccount: string;
  destinationAccount?: string;
  isRecurrent?: boolean;
  amount: number;
  createdAt: number; // Unix timestamp in milliseconds
}
