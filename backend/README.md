# Backend

Serverless backend for Guru Finance. Runs as AWS Lambda functions behind API Gateway HTTP API, with DynamoDB for persistence. Architecture follows Domain-Driven Design (DDD) with Clean Architecture layering and TSyringe for dependency injection.

---

## Architecture Overview

The backend uses a strict DDD layering. Each feature module is fully self-contained and follows the same structure.

```
Request (API Gateway)
        │
        ▼
┌───────────────────┐
│   Entrypoints     │  Lambda handlers — parse HTTP event, call service, return response
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Application      │  Services (use-cases), DTOs, Mappers
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Domain           │  Models, enums, repository interfaces (no external deps)
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Infrastructure   │  DynamoDB repository, DB entities, infra mappers
└───────────────────┘
```

### Layer responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| Entrypoints | `src/entrypoints/` | Lambda handler exports, I/O boundary |
| Application | `src/modules/<feature>/application/` | Use-case services, DTOs, application mappers |
| Domain | `src/modules/<feature>/domain/` | Models, enums, repository port interfaces |
| Infrastructure | `src/modules/<feature>/intrastructure/` | DynamoDB repository, DB entities, infra mappers |
| Shared | `src/shared/` | DI container, decorators, errors, DB client, env helpers |

---

## Repository Layout

```
backend/
├── src/
│   ├── entrypoints/
│   │   └── transactions/       # Lambda handler files (one per operation)
│   │       ├── create.ts
│   │       ├── delete.ts
│   │       ├── get-all.ts
│   │       └── update.ts
│   ├── modules/
│   │   └── transactions/
│   │       ├── application/
│   │       │   ├── dtos/       # Input/output shapes (interfaces)
│   │       │   ├── mappers/    # DTO ↔ domain model conversions
│   │       │   └── service/    # Use-case services
│   │       ├── domain/
│   │       │   ├── models/     # Domain model class + TransactionType enum
│   │       │   └── ports/      # Repository interface (abstract contract)
│   │       ├── intrastructure/
│   │       │   ├── entities/   # DynamoDB item shapes
│   │       │   ├── mappers/    # Entity ↔ domain model conversions
│   │       │   └── repository/ # Concrete DynamoDB implementation
│   │       └── transaction.module.ts   # DI registrations
│   └── shared/
│       ├── container/          # Lazy-initialized DI container proxy
│       ├── database/           # DynamoDB client factory
│       ├── decorators/         # @ErrorHandler, @WithContainer, TSyringe wrappers
│       ├── errors/             # DomainError class
│       ├── helpers/            # Envs accessor, utils
│       └── ports/              # Generic Service<I,O> interface
├── infra/
│   ├── custom/dynamodb.yml     # DynamoDB Local plugin config
│   ├── functions/transactions.yml  # Lambda function definitions
│   ├── permissions/iam.yml     # IAM role statements
│   └── resources/dynamodb.yml  # DynamoDB table CloudFormation resource
├── docker-compose.yml          # DynamoDB Local container
├── serverless.yml              # Main Serverless Framework config
├── tsconfig.json
└── package.json
```

---

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 24 | Lambda runtime |
| TypeScript | 5.9 | Language (strict mode, no emit) |
| Serverless Framework | 4.x | IaC — Lambda, API Gateway, DynamoDB |
| TSyringe | 4.x | Dependency injection container |
| AWS SDK v3 | 3.585+ | DynamoDB client |
| serverless-offline | 14.x | Local Lambda + API Gateway emulation |
| serverless-dynamodb-local | 0.2.x | DynamoDB Local plugin |

---

## Key Patterns

### Dependency Injection (TSyringe)

All injectable classes are marked with `@Injectable()`. The DI container is initialized lazily via a Proxy in `src/shared/container/di-container.ts` — module registration happens once on the first container access.

Always use the local decorator wrappers, never import directly from `tsyringe` in feature modules:

```typescript
import { Injectable, InjectRepository } from "@/shared/decorators/tsyringe.decorator";

@Injectable()
export class CreateTransactionService {
  constructor(
    @InjectRepository(TransactionModel)
    private readonly transactionRepository: TransactionRepository,
  ) {}
}
```

### Decorator-based error handling

Two method decorators are stacked on every Lambda handler:

- `@ErrorHandler()` — wraps the handler in try/catch; maps `DomainError` to the correct HTTP status, everything else to 500.
- `@WithContainer()` — injects the DI container as a second argument to the handler method.

```typescript
class CreateHandler {
  @ErrorHandler()
  @WithContainer()
  static async handler(event: APIGatewayEvent, container: DependencyContainer) {
    // container is injected automatically
  }
}
```

### DTO pattern

DTOs are plain interfaces — no classes, no runtime overhead. They define the shape of data crossing layer boundaries:

```typescript
// Input DTO — what the Lambda handler receives from the request body
export interface CreateTransactionInputDto {
  userId: string;
  description: string;
  type: TransactionType;      // "income" | "expense" | "transfer"
  category?: string;
  sourceAccount: string;
  amount: number;
  createdAt: string;          // ISO 8601
}

// Output DTO — what the service returns to the handler
export interface TransactionDto {
  id: string;
  description: string;
  type: TransactionType;
  category?: string | null;
  sourceAccount: string;
  amount: number;
  createdAt: string;          // ISO 8601
}
```

### Mapper pattern

Mapper classes contain only static methods and are never instantiated. Two mapper levels exist:

- **Application mapper** (`application/mappers/`) — DTO ↔ domain model
- **Infrastructure mapper** (`intrastructure/mappers/`) — DynamoDB entity ↔ domain model

### DomainError

Throw `DomainError` for business rule violations. It carries an HTTP status code and is caught automatically by `@ErrorHandler()`:

```typescript
import { DomainError } from "@/shared/errors/domain.error";

throw new DomainError("Transaction not found", 404);
```

---

## Environment Variables

Access env vars via `@/shared/helpers/envs.ts` — never use `process.env` directly in feature code. Copy `.env.template` to `.env` before running locally.

```bash
cp .env.template .env
```

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Runtime environment (`dev` / `prod`) | `dev` |
| `IS_OFFLINE` | `true` when running locally via serverless-offline | `false` |
| `PORT` | Port for the serverless-offline API Gateway emulation | `3000` |
| `TRANSACTIONS_TABLE` | DynamoDB table name (injected by Serverless Framework) | `transactions-table` |
| `DYNAMODB_LOCAL_REGION` | AWS region value for the DynamoDB Local client (e.g. `localhost`) | `""` |
| `DYNAMODB_LOCAL_ENDPOINT` | Endpoint URL for the DynamoDB Local Docker container | `""` |
| `AWS_ACCESS_KEY_ID` | AWS credentials (use `local` when running offline) | — |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials (use `local` when running offline) | — |
| `AWS_REGION` | AWS deployment region | `us-east-2` |

---

## Development Guide

### 1. Start DynamoDB Local

```bash
npm run dynamodb:start
```

Starts the `amazon/dynamodb-local` Docker container on port `8000` (in-memory, shared DB mode). The `serverless-dynamodb-local` plugin creates the table automatically on startup (`migrate: true`).

### 2. Start the dev server

```bash
npm run dev
```

Runs `serverless offline start --stage dev --reloadHandler`. The API Gateway emulation listens on **http://localhost:3000**.

### Type checking

```bash
npx tsc --noEmit
```

There is no build step — TypeScript is transpiled at runtime by Serverless Framework. `tsconfig.json` sets `"noEmit": true`.

---

## API Endpoints

Base URL (local): `http://localhost:3000`

| Method | Path | Description |
|---|---|---|
| `GET` | `/transactions` | List all transactions for a user |
| `POST` | `/transactions` | Create a new transaction |
| `PUT` | `/transactions/{id}` | Update an existing transaction |
| `DELETE` | `/transactions/{id}` | Delete a transaction |

User identity is resolved from (in priority order):
1. Cognito authorizer claims (`requestContext.authorizer.claims.sub`)
2. `x-user-id` request header
3. `userId` path parameter

### Request / Response examples

**GET /transactions**

```bash
curl http://localhost:3000/transactions \
  -H "x-user-id: 123"
```

```json
[
  {
    "id": "a1b2c3d4-...",
    "description": "Salary",
    "type": "income",
    "category": "Work",
    "sourceAccount": "Checking",
    "amount": 3000,
    "createdAt": "2026-03-01T00:00:00.000Z"
  }
]
```

**POST /transactions**

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 123" \
  -d '{
    "description": "Groceries",
    "type": "expense",
    "category": "Food",
    "sourceAccount": "Checking",
    "amount": 85.50,
    "createdAt": "2026-03-28T10:00:00.000Z"
  }'
```

```json
{ "message": "Transaction created successfully", "id": "a1b2c3d4-..." }
```

**PUT /transactions/{id}**

```bash
curl -X PUT http://localhost:3000/transactions/a1b2c3d4-... \
  -H "Content-Type: application/json" \
  -H "x-user-id: 123" \
  -d '{
    "description": "Groceries (updated)",
    "type": "expense",
    "category": "Food",
    "sourceAccount": "Checking",
    "amount": 90.00,
    "createdAt": "2026-03-28T10:00:00.000Z"
  }'
```

```json
{ "message": "Transaction updated successfully" }
```

**DELETE /transactions/{id}**

```bash
curl -X DELETE http://localhost:3000/transactions/a1b2c3d4-... \
  -H "x-user-id: 123"
```

```json
{ "message": "Transaction deleted successfully" }
```

### Error responses

| Status | Condition |
|---|---|
| 400 | Missing required field (e.g. `userId`) |
| 4xx | Domain rule violation (`DomainError` with custom status) |
| 500 | Unhandled server error |

---

## DynamoDB Schema

Table name: `transactions-table` (dev: `transactions-table-dev`)

| Attribute | Type | Role |
|---|---|---|
| `userId` | String | Partition key (HASH) |
| `id` | String | Sort key (RANGE) — UUID |
| `description` | String | — |
| `type` | String | `income` / `expense` / `transfer` |
| `category` | String | Optional |
| `sourceAccount` | String | — |
| `amount` | Number | — |
| `createdAt` | Number | Unix timestamp (ms) |

**Global Secondary Indexes:**

| Index | HASH | RANGE | Use case |
|---|---|---|---|
| `userIdTypeIndex` | `userId` | `type` | Filter by transaction type |
| `userIdStatusIndex` | `userId` | — | All transactions for a user |
| `userIdCreatedAtIndex` | `userId` | `createdAt` | Sort by date |

Billing mode: **PAY_PER_REQUEST** (on-demand).

---

## Deployment

### Stages

| Stage | Command | DynamoDB table |
|---|---|---|
| `dev` | `npm run deploy:dev` | `transactions-table-dev` |
| `prod` | `npm run deploy:prod` | `transactions-table` |

### AWS resources created

- **API Gateway HTTP API** — single regional endpoint (`us-east-2` by default)
- **AWS Lambda** — 4 functions (one per CRUD operation, Node.js 24.x runtime)
- **DynamoDB table** — with 3 GSIs, PAY_PER_REQUEST billing
- **IAM role** — least-privilege access to the DynamoDB table

### Tear down

```bash
npm run undeploy:dev
npm run undeploy:prod
```

### CI/CD (GitHub Actions)

The workflow at `.github/workflows/deploy.yml` triggers on push to `main` or `dev`:

1. Installs backend dependencies
2. Configures AWS credentials from GitHub secrets
3. Runs `npm run deploy:<stage>` and captures output
4. Extracts the API Gateway URL from deploy output
5. Passes the URL as `VITE_API_URL` to the frontend build job

**Required GitHub secrets:**

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `SERVERLESS_ACCESS_KEY` | Serverless Framework dashboard access key |

**Required GitHub variable:**

| Variable | Description |
|---|---|
| `AWS_REGION` | Deployment region (e.g. `us-east-2`) |
