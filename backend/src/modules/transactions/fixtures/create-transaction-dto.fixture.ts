import type { CreateTransactionInputDto } from "@/modules/transactions/application/dtos/create-transaction.dto";
import { TransactionType } from "@/modules/transactions/domain/models/transaction.model";

export const makeCreateTransactionInputDto = (
  overrides: Partial<CreateTransactionInputDto> = {},
): CreateTransactionInputDto => ({
  userId: "user-1",
  description: "Salary",
  type: TransactionType.INCOME,
  sourceAccount: "bank-account-1",
  amount: 5000,
  createdAt: "2024-01-15T10:00:00.000Z",
  ...overrides,
});
