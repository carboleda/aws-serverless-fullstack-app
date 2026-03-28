import "reflect-metadata";
import type { DependencyContainer } from "tsyringe";
import type { APIGatewayEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { WithContainer } from "@/shared/decorators/with-container.decorator";
import { ErrorHandler } from "@/shared/decorators/error-handler.decorator";
import { UpdateTransactionService } from "@/modules/transactions/application/service/update-transaction.service";

class UpdateHandler {
  @ErrorHandler()
  @WithContainer()
  static async handler(event: APIGatewayEvent, container: DependencyContainer) {
    const id = event.pathParameters?.id;
    const userId =
      event.requestContext?.authorizer?.claims?.sub ||
      event.headers?.["x-user-id"] ||
      event.pathParameters?.userId;
    const body = JSON.parse(event.body || "{}");

    await container
      .resolve(UpdateTransactionService)
      .execute({ ...body, id, userId });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Transaction updated successfully" }),
    };
  }
}

export const handler = UpdateHandler.handler;
