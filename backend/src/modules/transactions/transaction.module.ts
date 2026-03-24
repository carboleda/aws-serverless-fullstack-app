import { container } from "tsyringe";
import { CreateTransactionService } from "@/modules/transactions/application/service/create-transaction.service";
import { UpdateTransactionService } from "@/modules/transactions/application/service/update-transaction.service";
import { DeleteTransactionService } from "@/modules/transactions/application/service/delete-transaction.service";
import { FilterTransactionsService } from "@/modules/transactions/application/service/filter-transactions.service";
import { getRepositoryToken } from "@/shared/decorators/tsyringe.decorator";
import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import { TransactionDynamoRepository } from "@/modules/transactions/intraestructure/repository/transaction-dynamodb.repository";

export class TransactionModule {
  static register(): void {
    // Register services
    container.register(CreateTransactionService, {
      useClass: CreateTransactionService,
    });

    container.register(UpdateTransactionService, {
      useClass: UpdateTransactionService,
    });

    container.register(DeleteTransactionService, {
      useClass: DeleteTransactionService,
    });

    container.register(FilterTransactionsService, {
      useClass: FilterTransactionsService,
    });

    container.register(getRepositoryToken(TransactionModel), {
      useClass: TransactionDynamoRepository,
    });
  }
}
