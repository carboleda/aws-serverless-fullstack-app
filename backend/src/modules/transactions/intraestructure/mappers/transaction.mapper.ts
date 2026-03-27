import { TransactionModel } from "@/modules/transactions/domain/models/transaction.model";
import { TransactionEntity } from "@/modules/transactions/intraestructure/entities/transaction.entity";
import { omitUndefined } from "@/shared/helpers/utils";

export class TransactionMapper {
  static toModel(entity: TransactionEntity, id: string): TransactionModel {
    return new TransactionModel({
      ...entity,
      id,
      createdAt: new Date(entity.createdAt),
    });
  }

  static toEntity(model: TransactionModel): TransactionEntity {
    const raw = {
      ...model,
      createdAt: model.createdAt.getTime(),
    };
    return omitUndefined(raw) as TransactionEntity;
  }
}
