import "reflect-metadata";
import { container } from "tsyringe";
import { CreateTransactionService } from "@/modules/transactions/application/service/create-transaction.service";
import { TransactionMapper } from "@/modules/transactions/application/mappers/transaction.mapper";
import { getRepositoryToken } from "@/shared/decorators/di.decorator";
import type { TransactionRepository } from "@/modules/transactions/domain/ports/transaction.repository";
import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import { makeCreateTransactionInputDto } from "@/modules/transactions/fixtures/create-transaction-dto.fixture";

describe("CreateTransactionService", () => {
  let service: CreateTransactionService;
  let transactionRepository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    container.clearInstances();
    jest.clearAllMocks();

    const mockRepository: jest.Mocked<TransactionRepository> = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
    };

    container.register(getRepositoryToken(TransactionModel), {
      useValue: mockRepository,
    });

    container.register(CreateTransactionService, {
      useClass: CreateTransactionService,
    });

    service = container.resolve(CreateTransactionService);
    transactionRepository = container.resolve<jest.Mocked<TransactionRepository>>(
      getRepositoryToken(TransactionModel),
    );
  });

  describe("execute", () => {
    it("should return the id produced by the repository", async () => {
      const generatedId = "generated-uuid-123";
      transactionRepository.create.mockResolvedValue(generatedId);

      const result = await service.execute(makeCreateTransactionInputDto());

      expect(result).toBe(generatedId);
    });

    it("should call repository.create exactly once", async () => {
      transactionRepository.create.mockResolvedValue("some-id");

      await service.execute(makeCreateTransactionInputDto());

      expect(transactionRepository.create).toHaveBeenCalledTimes(1);
    });

    it("should pass a TransactionModel built from the DTO to the repository", async () => {
      transactionRepository.create.mockResolvedValue("some-id");
      const input = makeCreateTransactionInputDto();
      const expectedModel = TransactionMapper.fromCreateDtoToModel(input);

      await service.execute(input);

      expect(transactionRepository.create).toHaveBeenCalledWith(expectedModel);
    });

    it("should set id to null on the model passed to the repository", async () => {
      transactionRepository.create.mockResolvedValue("some-id");

      await service.execute(makeCreateTransactionInputDto());

      const [passedModel] = transactionRepository.create.mock.calls[0];
      expect(passedModel.id).toBeNull();
    });

    it("should convert createdAt string to a Date on the model", async () => {
      transactionRepository.create.mockResolvedValue("some-id");
      const createdAt = "2024-06-01T08:30:00.000Z";

      await service.execute(makeCreateTransactionInputDto({ createdAt }));

      const [passedModel] = transactionRepository.create.mock.calls[0];
      expect(passedModel.createdAt).toEqual(new Date(createdAt));
    });

    it("should propagate userId from the DTO to the model", async () => {
      transactionRepository.create.mockResolvedValue("some-id");
      const userId = "user-abc";

      await service.execute(makeCreateTransactionInputDto({ userId }));

      const [passedModel] = transactionRepository.create.mock.calls[0];
      expect(passedModel.userId).toBe(userId);
    });

    it("should support optional category being present on the model", async () => {
      transactionRepository.create.mockResolvedValue("some-id");
      const category = "groceries";

      await service.execute(makeCreateTransactionInputDto({ category }));

      const [passedModel] = transactionRepository.create.mock.calls[0];
      expect(passedModel.category).toBe(category);
    });

    it("should support optional category being absent (undefined)", async () => {
      transactionRepository.create.mockResolvedValue("some-id");

      await service.execute(makeCreateTransactionInputDto({ category: undefined }));

      const [passedModel] = transactionRepository.create.mock.calls[0];
      expect(passedModel.category).toBeUndefined();
    });

    it("should propagate repository errors to the caller", async () => {
      const dbError = new Error("DynamoDB unavailable");
      transactionRepository.create.mockRejectedValue(dbError);

      await expect(service.execute(makeCreateTransactionInputDto())).rejects.toThrow(
        "DynamoDB unavailable",
      );
    });
  });
});
