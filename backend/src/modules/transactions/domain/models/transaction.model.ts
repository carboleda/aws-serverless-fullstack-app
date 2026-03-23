export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETE = "complete",
}

export class TransactionModel {
  userId: string;
  id: string | null;
  description: string;
  paymentLink?: string | null;
  notes?: string | null;
  type: TransactionType;
  status: TransactionStatus;
  category?: string | null;
  sourceAccount: string;
  destinationAccount?: string;
  amount: number;
  createdAt: Date;
  isRecurrent?: boolean;

  constructor(params: {
    userId: string;
    id: string | null;
    description: string;
    paymentLink?: string | null;
    notes?: string | null;
    type: TransactionType;
    status: TransactionStatus;
    category?: string | null;
    sourceAccount: string;
    destinationAccount?: string;
    amount: number;
    createdAt: Date;
    isRecurrent?: boolean;
  }) {
    this.userId = params.userId;
    this.id = params.id;
    this.description = params.description;
    this.paymentLink = params.paymentLink;
    this.notes = params.notes;
    this.type = params.type;
    this.status = params.status;
    this.category = params.category;
    this.sourceAccount = params.sourceAccount;
    this.destinationAccount = params.destinationAccount;
    this.amount = params.amount;
    this.createdAt = params.createdAt;
    this.isRecurrent = params.isRecurrent ?? false;
  }
}
