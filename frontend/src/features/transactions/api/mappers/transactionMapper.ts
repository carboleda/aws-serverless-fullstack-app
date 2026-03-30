import type {
  Transaction,
  TransactionDto,
} from "@/features/transactions/types/transaction";

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
      id: dto.id!,
      createdAt: new Date(dto.createdAt),
    };
  }

  static fromFormData(formData: FormData): TransactionDto {
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    const description = formData.get("description")?.toString() || "";
    const amount = parseFloat(formData.get("amount")?.toString() || "0");
    const type = formData.get("type")?.toString() as Transaction["type"];
    const sourceAccount = formData.get("sourceAccount")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const createdAt = new Date().toISOString();

    return {
      description,
      amount,
      type,
      sourceAccount,
      category,
      createdAt,
    };
  }
}
