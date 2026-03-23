import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import { CreateTransactionInputDto } from "@/modules/transactions/application/dtos/create-transaction.dto";

export class TransactionMapper {
  static fromCreateDtoToModel(
    input: CreateTransactionInputDto,
  ): TransactionModel {
    return new TransactionModel({
      ...input,
      id: null,
      paymentLink: input.paymentLink ?? null,
      notes: input.notes ?? null,
      category: input.category ?? null,
      createdAt: new Date(input.createdAt),
    });
  }
}
