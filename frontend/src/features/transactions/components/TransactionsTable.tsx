import type React from "react";
import { useContext } from "react";
import {
  TransactionType,
  type Transaction,
} from "@/features/transactions/types/Tranaction";
import { Button, Table } from "@heroui/react";
import { formatDate } from "@/utils/date";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import { CiEdit, CiTrash } from "react-icons/ci";

interface TransactionProps {
  transactions: Transaction[];
}

export const TransactionsTable: React.FC<TransactionProps> = ({
  transactions,
}) => {
  const context = useContext(TransactionContext);

  const handleEdit = (transaction: Transaction) => {
    context?.setSelectedTransaction(transaction);
    context?.dialogState.open();
  };

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Example table">
          <Table.Header>
            <Table.Column isRowHeader>Description</Table.Column>
            <Table.Column>Type</Table.Column>
            <Table.Column>Category</Table.Column>
            <Table.Column>Source Account</Table.Column>
            <Table.Column>Amount</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {transactions.map((transaction) => (
              <Table.Row key={transaction.id}>
                <Table.Cell>{transaction.description}</Table.Cell>
                <Table.Cell>
                  {transaction.type === TransactionType.INCOME
                    ? "Income"
                    : "Expense"}
                </Table.Cell>
                <Table.Cell>{transaction.category}</Table.Cell>
                <Table.Cell>{transaction.sourceAccount}</Table.Cell>
                <Table.Cell>{transaction.amount}</Table.Cell>
                <Table.Cell>{formatDate(transaction.createdAt)}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Edit transaction"
                      onPress={() => handleEdit(transaction)}
                    >
                      <CiEdit className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger-soft"
                      aria-label="Delete transaction"
                      isDisabled
                    >
                      <CiTrash className="size-4" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      <Table.Footer className="flex justify-center">
        <Table.LoadMoreContent>Load more</Table.LoadMoreContent>
      </Table.Footer>
    </Table>
  );
};
