import "reflect-metadata";
import type { DependencyContainer } from "tsyringe";
import type { APIGatewayEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { WithContainer } from "@/shared/decorators/with-container.decorator";
import { ErrorHandler } from "@/shared/decorators/error-handler.decorator";
import { DeleteTransactionService } from "@/modules/transactions/application/service/delete-transaction.service";

class DeleteHandler {
  @ErrorHandler()
  @WithContainer()
  static async handler(event: APIGatewayEvent, container: DependencyContainer) {
    const id = event.pathParameters?.id!;
    const userId =
      event.requestContext?.authorizer?.claims?.sub ||
      event.headers?.["x-user-id"] ||
      event.pathParameters?.userId;

    await container.resolve(DeleteTransactionService).execute({ id, userId });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Transaction deleted successfully" }),
    };
  }
}

export const handler = DeleteHandler.handler;
