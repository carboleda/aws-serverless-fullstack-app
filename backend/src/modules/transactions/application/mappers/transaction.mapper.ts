import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import { CreateTransactionInputDto } from "@/modules/transactions/application/dtos/create-transaction.dto";
import { UpdateTransactionInputDto } from "@/modules/transactions/application/dtos/update-transaction.dto";
import { TransactionDto } from "@/modules/transactions/application/dtos/transactions.dto";

export class TransactionMapper {
  static fromModelToDto(model: TransactionModel): TransactionDto {
    return {
      ...model,
      id: model.id!,
      sourceAccount: model.sourceAccount,
      createdAt: model.createdAt.toISOString(),
    };
  }

  static fromCreateDtoToModel(
    input: CreateTransactionInputDto,
  ): TransactionModel {
    return new TransactionModel({
      ...input,
      id: null,
      createdAt: new Date(input.createdAt),
    });
  }

  static fromUpdateDtoToModel(
    input: UpdateTransactionInputDto,
  ): TransactionModel {
    return new TransactionModel({
      ...input,
      createdAt: new Date(input.createdAt),
    });
  }
}
