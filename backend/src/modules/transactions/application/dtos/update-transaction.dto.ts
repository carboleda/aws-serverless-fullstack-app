import { CreateTransactionInputDto } from "./create-transaction.dto";

export interface UpdateTransactionInputDto extends CreateTransactionInputDto {
  id: string;
}
