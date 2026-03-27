import type React from "react";
import {
  TransactionTypes,
  type Transaction,
} from "@/features/transactions/types/Tranaction";
import { Table } from "@heroui/react";
import { formatDate } from "@/utils/date";
import { TableActions } from "@/features/transactions/components/TableActions";
import { formatCurrency } from "@/utils/currency";
import { TransactionTypeIndicator } from "@/features/transactions/components/TransactionTypeIndicator";

interface TransactionProps {
  transactions: Transaction[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export const TransactionsTable: React.FC<TransactionProps> = ({
  transactions,
  isLoading,
  isFetching,
}) => {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Transactions table">
          <Table.Header>
            <Table.Column isRowHeader className="font-bold">
              Description
            </Table.Column>
            <Table.Column className="hidden md:table-cell font-bold">
              Type
            </Table.Column>
            <Table.Column className="font-bold">Category</Table.Column>
            <Table.Column className="hidden md:table-cell font-bold">
              Source Account
            </Table.Column>
            <Table.Column className="text-end font-bold">Amount</Table.Column>
            <Table.Column className="font-bold">Date</Table.Column>
            <Table.Column className="text-center font-bold">
              Actions
            </Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Collection items={transactions}>
              {(transaction) => (
                <Table.Row key={transaction.id}>
                  <Table.Cell>{transaction.description}</Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    <TransactionTypeIndicator type={transaction.type}>
                      {transaction.type === TransactionTypes.INCOME
                        ? "Income"
                        : "Expense"}
                    </TransactionTypeIndicator>
                  </Table.Cell>
                  <Table.Cell>{transaction.category}</Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    {transaction.sourceAccount}
                  </Table.Cell>
                  <Table.Cell className="text-end">
                    <TransactionTypeIndicator type={transaction.type} withIcon>
                      {formatCurrency(transaction.amount)}
                    </TransactionTypeIndicator>
                  </Table.Cell>
                  <Table.Cell>{formatDate(transaction.createdAt)}</Table.Cell>
                  <Table.Cell className="text-center">
                    <TableActions transaction={transaction} />
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Collection>
            <Table.LoadMore isLoading={isLoading || isFetching}>
              <Table.LoadMoreContent>
                {isLoading || isFetching ? "Loading..." : "Load More"}
              </Table.LoadMoreContent>
            </Table.LoadMore>
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
