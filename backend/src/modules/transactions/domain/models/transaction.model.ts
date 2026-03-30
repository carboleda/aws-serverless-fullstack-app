export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export class TransactionModel {
  userId: string;
  id: string | null;
  description: string;
  type: TransactionType;
  category?: string | null;
  sourceAccount: string;
  amount: number;
  createdAt: Date;

  constructor(params: {
    userId: string;
    id: string | null;
    description: string;
    type: TransactionType;
    category?: string | null;
    sourceAccount: string;
    amount: number;
    createdAt: Date;
  }) {
    this.userId = params.userId;
    this.id = params.id;
    this.description = params.description;
    this.type = params.type;
    this.category = params.category;
    this.sourceAccount = params.sourceAccount;
    this.amount = params.amount;
    this.createdAt = params.createdAt;
  }
}
