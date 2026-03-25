import type { TransactionRepository } from "@/modules/transactions/domain/ports/transaction.repository";
import {
  TransactionModel,
  TransactionType,
} from "@/modules/transactions/domain/models/transaction.model";
import {
  InjectRepository,
  Injectable,
} from "@/shared/decorators/tsyringe.decorator";
import { Service } from "@/shared/ports/service.interface";
import { UpdateTransactionInputDto } from "@/modules/transactions/application/dtos/update-transaction.dto";
import { TransactionMapper } from "@/modules/transactions/application/mappers/transaction.mapper";
import { DomainError } from "@/shared/errors/domain.error";

@Injectable()
export class UpdateTransactionService implements Service<
  UpdateTransactionInputDto,
  void
> {
  constructor(
    @InjectRepository(TransactionModel)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(transaction: UpdateTransactionInputDto): Promise<void> {
    // Validate that TRANSFER has destinationAccount
    if (
      transaction.type === TransactionType.TRANSFER &&
      !transaction.destinationAccount
    ) {
      throw new DomainError(
        "Transfer transactions must have a destinationAccount",
        400,
      );
    }

    const transactionModel =
      TransactionMapper.fromUpdateDtoToModel(transaction);
    const affectedRows = await this.transactionRepository.update(transactionModel);
    if (affectedRows === 0) {
      throw new DomainError("Transaction not found", 404);
    }
  }
}
