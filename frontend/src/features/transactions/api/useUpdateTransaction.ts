import { TransactionMapper } from "@/features/transactions/api/mappers/transactionMapper";
import { api } from "@/services/api";
import { queryClient } from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";

export const updateTransaction = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<string> => {
  const dto = TransactionMapper.fromFormData(formData);
  return api
    .put(`/transactions/${id}`, dto, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((response) => response.data);
};

export const useUpdateTransaction = () => {
  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
};
