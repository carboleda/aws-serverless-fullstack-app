import { randomUUID } from "crypto";
import { Injectable, Inject } from "@/shared/decorators/tsyringe.decorator";
import { TransactionRepository } from "@/modules/transactions/domain/ports/transaction.repository";
import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import { TransactionMapper } from "@/modules/transactions/intraestructure/mappers/transaction.mapper";
import DynamoDBDataSource from "@/shared/database/dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

@Injectable()
export class TransactionDynamoRepository implements TransactionRepository {
  private tableName = "transactions-table";

  constructor(
    @Inject(DynamoDBDataSource) private dynamoDb: DynamoDBDataSource,
  ) {}

  async create(transaction: TransactionModel): Promise<string> {
    const id = randomUUID();
    const entity = TransactionMapper.toEntity(transaction);

    console.log("Creating transaction with ID:", id, "and data:", entity);

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        id,
        ...entity,
      },
    });

    const client = this.dynamoDb.getConnection();
    await client.send(command);

    return id;
  }

  update(transaction: TransactionModel): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(userId: string, id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getById(userId: string, id: string): Promise<TransactionModel | null> {
    throw new Error("Method not implemented.");
  }

  getAll(userId: string): Promise<TransactionModel[]> {
    throw new Error("Method not implemented.");
  }
}
