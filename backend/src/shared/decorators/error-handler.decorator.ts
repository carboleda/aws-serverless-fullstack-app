import { DomainError } from "@/shared/errors/domain.error";
import type { APIGatewayEvent } from "aws-lambda/trigger/api-gateway-proxy";

export function ErrorHandler(): MethodDecorator {
  return (_target, _key, descriptor: PropertyDescriptor) => {
    const original: (event: APIGatewayEvent) => Promise<any> = descriptor.value;
    descriptor.value = async (event: APIGatewayEvent) => {
      try {
        return await original(event);
      } catch (err) {
        if (err instanceof DomainError) {
          return {
            statusCode: err.statusCode,
            body: JSON.stringify({ error: err.message }),
          };
        }
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Internal server error" }),
        };
      }
    };
    return descriptor;
  };
}
