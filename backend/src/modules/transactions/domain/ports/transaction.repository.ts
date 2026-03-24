import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";

export interface TransactionRepository {
  create(transaction: TransactionModel): Promise<string>;
  update(transaction: TransactionModel): Promise<void>;
  delete(userId: string, id: string): Promise<void>;
  getAll(userId: string): Promise<TransactionModel[]>;
}
