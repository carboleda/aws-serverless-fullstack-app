import "reflect-metadata";
import { container } from "tsyringe";
import { TransactionModule } from "@/modules/transactions/transaction.module";
import { FilterTransactionsService } from "@/modules/transactions/application/service/filter-transactions.service";
import { CreateTransactionService } from "@/modules/transactions/application/service/create-transaction.service";

let isInitialized = false;
function ensureInitialized() {
  if (!isInitialized) {
    // Initialize all modules
    TransactionModule.register();
    isInitialized = true;
  }
}

// Export the container for use in route handlers with lazy initialization
export const containerProxy = new Proxy(container, {
  get(target, prop) {
    ensureInitialized();
    return target[prop as keyof typeof container];
  },
});

export const get = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: 1,
      amount: 100,
      description: "Grocery shopping",
      date: "2024-06-01",
    }),
  };
};

export const getAll = async (event: any) => {
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

  const filterTransactionsService = containerProxy.resolve(
    FilterTransactionsService,
  );
  const transactions = await filterTransactionsService.execute(userId);

  return {
    statusCode: 200,
    body: JSON.stringify(transactions),
  };
};

export const create = async (event: any) => {
  const body = JSON.parse(event.body);

  const createTransactionService = containerProxy.resolve(
    CreateTransactionService,
  );

  const id = await createTransactionService.execute(body);

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Transaction created successfully", id }),
  };
};
