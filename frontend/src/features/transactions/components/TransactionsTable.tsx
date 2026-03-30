import type React from "react";
import {
  TransactionTypes,
  type Transaction,
} from "@/features/transactions/types/transaction";
import { EmptyState, ErrorMessage, Spinner, Table } from "@heroui/react";
import { formatDate } from "@/utils/date";
import { TableActions } from "@/features/transactions/components/TableActions";
import { formatCurrency } from "@/utils/currency";
import { TransactionTypeIndicator } from "@/features/transactions/components/TransactionTypeIndicator";
import { GoInbox } from "react-icons/go";
import classNames from "classnames";
import { MdError } from "react-icons/md";

interface TransactionProps {
  transactions: Transaction[];
  loadingError?: Error | null;
  isLoading?: boolean;
  isFetching?: boolean;
}

export const TransactionsTable: React.FC<TransactionProps> = ({
  transactions,
  isLoading,
  isFetching,
  loadingError,
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
            <Table.Column className="hidden md:table-cell font-bold">
              Category
            </Table.Column>
            <Table.Column className="hidden md:table-cell font-bold">
              Source Account
            </Table.Column>
            <Table.Column className="text-end font-bold">Amount</Table.Column>
            <Table.Column className="hidden md:table-cell font-bold">
              Date
            </Table.Column>
            <Table.Column className="text-center font-bold">
              Actions
            </Table.Column>
          </Table.Header>
          <Table.Body
            className={classNames({ "animate-pulse opacity-20": isFetching })}
            renderEmptyState={() => (
              <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                <EmptyStateContent
                  isLoading={isLoading}
                  loadingError={loadingError}
                />
              </EmptyState>
            )}
          >
            <Table.Collection items={transactions}>
              {(transaction) => (
                <Table.Row key={transaction.id}>
                  <Table.Cell>
                    <span className="hidden md:inline-block">
                      {transaction.description}
                    </span>
                    <div className="flex flex-col items-start gap-0 md:hidden">
                      <span className="font-bold">
                        {transaction.description}
                      </span>
                      <span className="text-muted">{transaction.category}</span>
                      <span className="text-muted">
                        {formatDate(transaction.createdAt)}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    <TransactionTypeIndicator type={transaction.type}>
                      {transaction.type === TransactionTypes.INCOME
                        ? "Income"
                        : "Expense"}
                    </TransactionTypeIndicator>
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    {transaction.category}
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    {transaction.sourceAccount}
                  </Table.Cell>
                  <Table.Cell className="text-end">
                    <TransactionTypeIndicator type={transaction.type} withIcon>
                      {formatCurrency(transaction.amount)}
                    </TransactionTypeIndicator>
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    {formatDate(transaction.createdAt)}
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    <TableActions transaction={transaction} />
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Collection>
            {/* <Table.LoadMore isLoading={isLoading || isFetching}>
              <Table.LoadMoreContent>
                {isLoading || isFetching ? "Loading..." : "Load More"}
              </Table.LoadMoreContent>
            </Table.LoadMore> */}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};

const EmptyStateContent: React.FC<{
  isLoading?: boolean;
  loadingError?: Error | null;
}> = ({ isLoading, loadingError }) => {
  if (loadingError) {
    return (
      <>
        <MdError className="size-6 text-muted" />
        <ErrorMessage className="text-sm">
          Error loading transactions "{loadingError.message}"
        </ErrorMessage>
      </>
    );
  }

  if (!isLoading) {
    return (
      <>
        <GoInbox className="size-6 text-muted" />
        <span className="text-sm text-muted">No transactions found</span>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Spinner />
        <span className="text-sm text-muted">Loading...</span>
      </>
    );
  }
};
