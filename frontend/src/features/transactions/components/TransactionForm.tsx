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
import { TransactionType } from "../types/Tranaction";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { HiCurrencyDollar } from "react-icons/hi";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import { useContext, useState } from "react";
import { useCreateTransaction } from "@/features/transactions/api/useCreateTransaction";

export const TransactionForm = () => {
  const context = useContext(TransactionContext);
  const [selectedTypes, setSelectedTypes] = useState(
    new Set<Key>([TransactionType.EXPENSE]),
  );
  const { mutate, isPending } = useCreateTransaction();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("type", [...selectedTypes].at(0) as string);

    mutate(formData, {
      onSuccess: onCloseDialog,
    });
  };

  const onCloseDialog = () => {
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
            <div>Transaction</div>
            <Description>Fill in the details for this transaction.</Description>
          </div>
        </Fieldset.Legend>
        <Separator orientation="horizontal" />
        <FieldGroup>
          <TextField
            isRequired
            name="description"
            validate={(value) =>
              value.trim().length < 3
                ? "Description must be at least 3 characters"
                : null
            }
          >
            <Label>Description</Label>
            <Input placeholder="e.g. Grocery shopping" />
            <FieldError />
          </TextField>

          <NumberField
            isRequired
            name="amount"
            defaultValue={1}
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
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input placeholder="0.00" />
              <NumberField.IncrementButton />
            </NumberField.Group>
            <FieldError />
          </NumberField>

          <TextField isRequired name="category">
            <Label>Category</Label>
            <Input placeholder="e.g. Food, Transport, Salary" />
            <FieldError />
          </TextField>

          <TextField isRequired name="type" className="flex flex-col gap-1">
            <Label>Type</Label>
            <ToggleButtonGroup
              defaultSelectedKeys={[TransactionType.EXPENSE]}
              selectedKeys={selectedTypes}
              onSelectionChange={setSelectedTypes}
              selectionMode="single"
              size="sm"
              fullWidth
            >
              <ToggleButton
                id={TransactionType.INCOME}
                className="text-success"
              >
                <FaArrowUp className="size-3 text-success" />
                Income
              </ToggleButton>
              <ToggleButton
                id={TransactionType.EXPENSE}
                className="text-danger"
              >
                <ToggleButtonGroup.Separator />
                <FaArrowDown className="size-3" />
                Expense
              </ToggleButton>
            </ToggleButtonGroup>
          </TextField>

          <TextField isRequired name="sourceAccount">
            <Label>Source Account</Label>
            <Input placeholder="e.g. Checking, Credit Card, Cash" />
            <FieldError />
          </TextField>
        </FieldGroup>
        <Fieldset.Actions>
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
