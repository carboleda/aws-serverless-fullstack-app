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
      throw new Error("Transfer transactions must have a destinationAccount");
    }

    const transactionModel =
      TransactionMapper.fromUpdateDtoToModel(transaction);
    await this.transactionRepository.update(transactionModel);
  }
}
