import type { TransactionRepository } from "@/modules/transactions/domain/ports/transaction.repository";
import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import {
  InjectRepository,
  Injectable,
} from "@/shared/decorators/tsyringe.decorator";

@Injectable()
export class FilterTransactionsService {
  constructor(
    @InjectRepository(TransactionModel)
    private readonly repository: TransactionRepository,
  ) {}

  async execute(userId: string): Promise<TransactionModel[]> {
    return this.repository.getAll(userId);
  }
}
