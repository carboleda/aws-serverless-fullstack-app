import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import { CreateTransactionInputDto } from "@/modules/transactions/application/dtos/create-transaction.dto";
import { TransactionDto } from "@/modules/transactions/application/dtos/transactions.dto";

export class TransactionMapper {
  static fromModelToDto(model: TransactionModel): TransactionDto {
    return {
      ...model,
      id: model.id!,
      sourceAccount: model.sourceAccount,
      destinationAccount: model.destinationAccount,
      createdAt: model.createdAt.toISOString(),
    };
  }

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
