import { container } from "tsyringe";
import { CreateTransactionService } from "@/modules/transactions/application/service/create-transaction.service";
import { getRepositoryToken } from "@/shared/decorators/tsyringe.decorator";
import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import { TransactionDynamoRepository } from "@/modules/transactions/intraestructure/repository/transaction-dynamodb.repository";

export class TransactionModule {
  static register(): void {
    // Register services
    container.register(CreateTransactionService, {
      useClass: CreateTransactionService,
    });

    container.register(getRepositoryToken(TransactionModel), {
      useClass: TransactionDynamoRepository,
    });
  }
}
