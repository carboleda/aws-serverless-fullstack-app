import { TransactionMapper } from "@/features/transactions/api/mappers/transactionMapper";
import { api } from "@/services/api";
import { queryClient } from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";

export const createTransaction = async (
  formData: FormData,
): Promise<string> => {
  const dto = TransactionMapper.fromFormData(formData);
  return api
    .post("/transactions", dto, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((response) => response.data);
};

export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
};
