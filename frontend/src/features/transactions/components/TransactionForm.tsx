import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  NumberField,
  Separator,
  Spinner,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  type Key,
} from "@heroui/react";
import { CiFloppyDisk } from "react-icons/ci";
import { TransactionTypes } from "../types/transaction";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { HiCurrencyDollar } from "react-icons/hi";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import { useContext, useState } from "react";
import { useCreateTransaction } from "@/features/transactions/api/useCreateTransaction";
import { useUpdateTransaction } from "@/features/transactions/api/useUpdateTransaction";

export const TransactionForm = () => {
  const context = useContext(TransactionContext);
  const selectedTransaction = context?.selectedTransaction ?? null;
  const isEditMode = selectedTransaction !== null;

  const [selectedTypes, setSelectedTypes] = useState(
    new Set<Key>([selectedTransaction?.type ?? TransactionTypes.EXPENSE]),
  );
  const { mutate: createMutate, isPending: isCreatePending } =
    useCreateTransaction();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateTransaction();

  const isPending = isCreatePending || isUpdatePending;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("type", [...selectedTypes].at(0) as string);

    if (isEditMode) {
      updateMutate(
        { id: selectedTransaction.id, formData },
        { onSuccess: onCloseDialog },
      );
    } else {
      createMutate(formData, { onSuccess: onCloseDialog });
    }
  };

  const onCloseDialog = () => {
    context?.setSelectedTransaction(null);
    context?.dialogState.close();
  };

  return (
    <Form
      className="w-full max-w-96 px-1"
      onSubmit={onSubmit}
      onReset={onCloseDialog}
    >
      <Fieldset>
        <Fieldset.Legend className="flex flex-row items-center gap-2 pb-4">
          <HiCurrencyDollar className="size-10 text-warning" />
          <div className="flex flex-col items-start">
            <div>{isEditMode ? "Edit Transaction" : "New Transaction"}</div>
            <Description>Fill in the details for this transaction.</Description>
          </div>
        </Fieldset.Legend>
        <Separator orientation="horizontal" />
        <FieldGroup>
          <TextField
            isRequired
            name="description"
            defaultValue={selectedTransaction?.description}
            validate={(value) =>
              value.trim().length < 3
                ? "Description must be at least 3 characters"
                : null
            }
          >
            <Label>Description</Label>
            <Input
              className="border border-border/60"
              placeholder="e.g. Grocery shopping"
            />
            <FieldError />
          </TextField>

          <NumberField
            isRequired
            name="amount"
            defaultValue={selectedTransaction?.amount ?? 1}
            minValue={0.1}
            step={0.1}
            formatOptions={{
              currency: "USD",
              style: "currency",
              currencySign: "accounting",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }}
          >
            <Label>Amount</Label>
            <NumberField.Group className="border border-border/60">
              <NumberField.DecrementButton />
              <NumberField.Input placeholder="0.00" />
              <NumberField.IncrementButton />
            </NumberField.Group>
            <FieldError />
          </NumberField>

          <TextField
            isRequired
            name="category"
            defaultValue={selectedTransaction?.category}
          >
            <Label>Category</Label>
            <Input
              className="border border-border/60"
              placeholder="e.g. Food, Transport, Salary"
            />
            <FieldError />
          </TextField>

          <TextField isRequired name="type" className="flex flex-col gap-1">
            <Label>Type</Label>
            <ToggleButtonGroup
              defaultSelectedKeys={[
                selectedTransaction?.type ?? TransactionTypes.EXPENSE,
              ]}
              selectedKeys={selectedTypes}
              onSelectionChange={setSelectedTypes}
              selectionMode="single"
              size="sm"
              disallowEmptySelection={true}
              fullWidth
            >
              <ToggleButton
                id={TransactionTypes.INCOME}
                className="text-success"
              >
                <FaArrowUp className="size-3 text-success" />
                Income
              </ToggleButton>
              <ToggleButton
                id={TransactionTypes.EXPENSE}
                className="text-danger"
              >
                <ToggleButtonGroup.Separator />
                <FaArrowDown className="size-3" />
                Expense
              </ToggleButton>
            </ToggleButtonGroup>
          </TextField>

          <TextField
            isRequired
            name="sourceAccount"
            defaultValue={selectedTransaction?.sourceAccount}
          >
            <Label>Source Account</Label>
            <Input
              className="border border-border/60"
              placeholder="e.g. Checking, Credit Card, Cash"
            />
            <FieldError />
          </TextField>
        </FieldGroup>
        <Fieldset.Actions className="justify-end!">
          <Button type="submit" isPending={isPending}>
            {({ isPending }) => (
              <>
                {isPending ? (
                  <Spinner color="current" size="sm" />
                ) : (
                  <CiFloppyDisk />
                )}
                {isPending ? "Saving..." : "Save"}
              </>
            )}
          </Button>
          <Button type="reset" variant="secondary" isPending={isPending}>
            Cancel
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
};
