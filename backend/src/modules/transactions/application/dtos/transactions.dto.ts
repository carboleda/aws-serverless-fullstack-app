import {
  TransactionStatus,
  TransactionType,
} from "@/modules/transactions/domain/models/transaction.model";

export interface TransactionDto {
  id: string;
  description: string;
  paymentLink?: string | null;
  notes?: string | null;
  type: TransactionType;
  status: TransactionStatus;
  category?: string | null;
  sourceAccount: string;
  destinationAccount?: string;
  amount: number;
  createdAt: string;
  isRecurrent?: boolean;
}
