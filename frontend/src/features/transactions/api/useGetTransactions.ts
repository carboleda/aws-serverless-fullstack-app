import { TransactionMapper } from "@/features/transactions/api/mappers/transactionMapper";
import { type Transaction } from "@/features/transactions/types/transaction";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const getTransactions = async (): Promise<Transaction[]> => {
  return api
    .get("/transactions", {
      headers: {
        Accept: "application/json",
      },
    })
    .then((response) => response.data.map(TransactionMapper.fromDto));
};

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
};
