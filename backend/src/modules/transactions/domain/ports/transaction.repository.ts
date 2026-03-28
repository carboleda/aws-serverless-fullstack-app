import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";

export interface TransactionRepository {
  create(transaction: TransactionModel): Promise<string>;
  update(transaction: TransactionModel): Promise<number>;
  delete(userId: string, id: string): Promise<number>;
  getAll(userId: string): Promise<TransactionModel[]>;
}
