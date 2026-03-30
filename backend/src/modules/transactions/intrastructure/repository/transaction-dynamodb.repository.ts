import { randomUUID } from "crypto";
import { Injectable, Inject } from "@/shared/decorators/di.decorator";
import { TransactionRepository } from "@/modules/transactions/domain/ports/transaction.repository";
import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import { TransactionMapper } from "@/modules/transactions/intrastructure/mappers/transaction.mapper";
import { TransactionEntity } from "@/modules/transactions/intrastructure/entities/transaction.entity";
import DynamoDBDataSource from "@/shared/database/dynamodb";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import Envs from "@/shared/helpers/envs";

@Injectable()
export class TransactionDynamoRepository implements TransactionRepository {
  private tableName = Envs.TRANSACTIONS_TABLE;

  constructor(
    @Inject(DynamoDBDataSource) private dynamoDb: DynamoDBDataSource,
  ) {}

  async create(transaction: TransactionModel): Promise<string> {
    const id = randomUUID();
    const entity = TransactionMapper.toEntity(transaction);

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        ...entity,
        id,
      },
    });

    const client = this.dynamoDb.getConnection();
    await client.send(command);

    return id;
  }

  async update(transaction: TransactionModel): Promise<number> {
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
      Key: { userId: transaction.userId, id: transaction.id },
      UpdateExpression: `set ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: "attribute_exists(id) AND attribute_exists(userId)",
    });

    const client = this.dynamoDb.getConnection();
    try {
      await client.send(command);
      return 1;
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        return 0;
      }
      throw error;
    }
  }

  async delete(userId: string, id: string): Promise<number> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { userId, id },
      ConditionExpression: "attribute_exists(id) AND attribute_exists(userId)",
    });

    const client = this.dynamoDb.getConnection();
    try {
      await client.send(command);
      return 1;
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        return 0;
      }
      throw error;
    }
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
