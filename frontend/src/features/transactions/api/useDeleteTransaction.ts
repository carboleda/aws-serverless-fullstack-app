import { api } from "@/services/api";
import { queryClient } from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";

export const deleteTransaction = async (id: string): Promise<void> => {
  return api
    .delete(`/transactions/${id}`, {
      headers: { Accept: "application/json" },
    })
    .then((response) => response.data);
};

export const useDeleteTransaction = () => {
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
};
