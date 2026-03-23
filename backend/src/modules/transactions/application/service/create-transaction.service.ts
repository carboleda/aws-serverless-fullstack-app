import type { TransactionRepository } from "@/modules/transactions/domain/ports/transaction.repository";
import {
  TransactionModel,
  TransactionType,
} from "@/modules/transactions/domain/models/transaction.model";
import {
  InjectRepository,
  Injectable,
} from "@/shared/decorators/tsyringe.decorator";
import { CreateTransactionInputDto } from "@/modules/transactions/application/dtos/create-transaction.dto";
import { Service } from "@/shared/ports/service.interface";
import { TransactionMapper } from "@/modules/transactions/application/mappers/transaction.mapper";

@Injectable()
export class CreateTransactionService implements Service<
  CreateTransactionInputDto,
  string
> {
  constructor(
    @InjectRepository(TransactionModel)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(transaction: CreateTransactionInputDto): Promise<string> {
    // Validate that TRANSFER has destinationAccount
    if (
      transaction.type === TransactionType.TRANSFER &&
      !transaction.destinationAccount
    ) {
      throw new Error("Transfer transactions must have a destinationAccount");
    }

    const transactionModel =
      TransactionMapper.fromCreateDtoToModel(transaction);
    const id = await this.transactionRepository.create(transactionModel);

    return id;
  }
}
