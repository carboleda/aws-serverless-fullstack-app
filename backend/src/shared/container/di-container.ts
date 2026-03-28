import { container as tsyringeContainer } from "tsyringe";
import { TransactionModule } from "@/modules/transactions/transaction.module";

let isInitialized = false;
function ensureInitialized() {
  if (!isInitialized) {
    TransactionModule.register();
    isInitialized = true;
  }
}

export const container = new Proxy(tsyringeContainer, {
  get(target, prop) {
    ensureInitialized();
    return target[prop as keyof typeof tsyringeContainer];
  },
});
