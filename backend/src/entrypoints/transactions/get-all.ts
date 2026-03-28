import "reflect-metadata";
import type { DependencyContainer } from "tsyringe";
import type { APIGatewayEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { WithContainer } from "@/shared/decorators/with-container.decorator";
import { ErrorHandler } from "@/shared/decorators/error-handler.decorator";
import { FilterTransactionsService } from "@/modules/transactions/application/service/filter-transactions.service";

class GetAllHandler {
  @ErrorHandler()
  @WithContainer()
  static async handler(event: APIGatewayEvent, container: DependencyContainer) {
    const userId =
      event.requestContext?.authorizer?.claims?.sub ||
      event.headers?.["x-user-id"] ||
      event.pathParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "userId is required" }),
      };
    }

    const transactions = await container
      .resolve(FilterTransactionsService)
      .execute(userId);

    return {
      statusCode: 200,
      body: JSON.stringify(transactions),
    };
  }
}

export const handler = GetAllHandler.handler;
