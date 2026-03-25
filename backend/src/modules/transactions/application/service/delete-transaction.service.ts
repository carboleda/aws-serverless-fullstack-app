import type { TransactionRepository } from "@/modules/transactions/domain/ports/transaction.repository";
import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import {
  InjectRepository,
  Injectable,
} from "@/shared/decorators/tsyringe.decorator";
import { DomainError } from "@/shared/errors/domain.error";
import { DeleteTransactionInputDto } from "../dtos/delete-transaction.dto";

@Injectable()
export class DeleteTransactionService {
  constructor(
    @InjectRepository(TransactionModel)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute({ userId, id }: DeleteTransactionInputDto): Promise<void> {
    const affectedRows = await this.transactionRepository.delete(userId, id);
    if (affectedRows === 0) {
      throw new DomainError("Transaction not found", 404);
    }
  }
}
