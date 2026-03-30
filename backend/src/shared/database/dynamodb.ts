import Envs from "@/shared/helpers/envs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Injectable } from "@/shared/decorators/di.decorator";

@Injectable()
export default class DynamoDBDataSource {
  private db: DynamoDBDocumentClient | null = null;

  public getConnection(): DynamoDBDocumentClient {
    if (!this.db) {
      const offlineOptions = {
        region: Envs.DYNAMODB_LOCAL_REGION,
        endpoint: Envs.DYNAMODB_LOCAL_ENDPOINT,
        credentials: {
          accessKeyId: Envs.AWS_ACCESS_KEY_ID,
          secretAccessKey: Envs.AWS_SECRET_ACCESS_KEY,
        },
      };

      const client = new DynamoDBClient(Envs.IS_OFFLINE ? offlineOptions : {});
      this.db = DynamoDBDocumentClient.from(client, {
        marshallOptions: { removeUndefinedValues: true },
      });
    }

    return this.db;
  }
}
