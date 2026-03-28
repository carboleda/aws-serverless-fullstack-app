import type { DependencyContainer } from "tsyringe";
import type { APIGatewayEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { container } from "@/shared/container/di-container";

export type ContainerHandler = (
  event: APIGatewayEvent,
  container: DependencyContainer,
) => Promise<any>;

export function WithContainer(): MethodDecorator {
  return (_target, _key, descriptor: PropertyDescriptor) => {
    const original: ContainerHandler = descriptor.value;
    descriptor.value = (event: APIGatewayEvent) => original(event, container);
    return descriptor;
  };
}
