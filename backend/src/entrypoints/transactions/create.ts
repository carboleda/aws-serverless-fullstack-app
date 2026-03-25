import "reflect-metadata";
import type { DependencyContainer } from "tsyringe";
import type { APIGatewayEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { WithContainer } from "@/shared/decorators/with-container.decorator";
import { ErrorHandler } from "@/shared/decorators/error-handler.decorator";
import { CreateTransactionService } from "@/modules/transactions/application/service/create-transaction.service";

class CreateHandler {
  @ErrorHandler()
  @WithContainer()
  static async handler(event: APIGatewayEvent, container: DependencyContainer) {
    const body = JSON.parse(event.body || "{}");
    const userId =
      event.requestContext?.authorizer?.claims?.sub ||
      event.headers?.["x-user-id"] ||
      event.pathParameters?.userId;

    const id = await container
      .resolve(CreateTransactionService)
      .execute({ ...body, userId });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Transaction created successfully", id }),
    };
  }
}

export const handler = CreateHandler.handler;
