import { randomUUID } from "crypto";
import { Injectable, Inject } from "@/shared/decorators/tsyringe.decorator";
import { TransactionRepository } from "@/modules/transactions/domain/ports/transaction.repository";
import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import { TransactionMapper } from "@/modules/transactions/intraestructure/mappers/transaction.mapper";
import { TransactionEntity } from "@/modules/transactions/intraestructure/entities/transaction.entity";
import DynamoDBDataSource from "@/shared/database/dynamodb";
import {
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

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

  async update(transaction: TransactionModel): Promise<void> {
    if (!transaction.id) {
      throw new Error("Transaction ID is required for update");
    }

    const entity = TransactionMapper.toEntity(transaction);
    const keys = new Set(["id", "userId"]);
    const fields = Object.keys(entity).filter((key) => !keys.has(key));

    const updateExpression = fields
      .map((key) => `#${key} = :${key}`)
      .join(", ");
    const expressionAttributeNames = Object.fromEntries(
      fields.map((key) => [`#${key}`, key]),
    );
    const expressionAttributeValues = Object.fromEntries(
      fields.map((key) => [`:${key}`, entity[key as keyof typeof entity]]),
    );

    const command = new UpdateCommand({
      TableName: this.tableName,
      ReturnValues: "ALL_OLD",
      Key: { userId: transaction.userId, id: transaction.id },
      UpdateExpression: `set ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    const client = this.dynamoDb.getConnection();
    const output = await client.send(command);

    if (!output.Attributes) {
      throw new Error("Transaction not found");
    }
  }

  async delete(userId: string, id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      ReturnValues: "ALL_OLD",
      Key: { userId, id },
    });

    const client = this.dynamoDb.getConnection();
    const output = await client.send(command);

    if (!output.Attributes) {
      throw new Error("Transaction not found");
    }
  }

  getById(userId: string, id: string): Promise<TransactionModel | null> {
    throw new Error("Method not implemented.");
  }

  async getAll(userId: string): Promise<TransactionModel[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });

    const client = this.dynamoDb.getConnection();
    const response = await client.send(command);

    if (!response.Items) {
      return [];
    }

    return response.Items.map((item) => {
      const entity = item as TransactionEntity & { id: string };
      return TransactionMapper.toModel(entity, entity.id);
    });
  }
}
