import type { TransactionRepository } from "@/modules/transactions/domain/ports/transaction.repository";
import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import { InjectRepository, Injectable } from "@/shared/decorators/di.decorator";
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
    const transactionModel =
      TransactionMapper.fromCreateDtoToModel(transaction);
    const id = await this.transactionRepository.create(transactionModel);

    return id;
  }
}
