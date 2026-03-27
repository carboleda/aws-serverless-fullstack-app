import type {
  Transaction,
  TransactionDto,
} from "@/features/transactions/types/Tranaction";

export class TransactionMapper {
  static toDto(transaction: Transaction): TransactionDto {
    return {
      ...transaction,
      createdAt: transaction.createdAt.toISOString(),
    };
  }

  static fromDto(dto: TransactionDto): Transaction {
    return {
      ...dto,
      createdAt: new Date(dto.createdAt),
    };
  }
}
