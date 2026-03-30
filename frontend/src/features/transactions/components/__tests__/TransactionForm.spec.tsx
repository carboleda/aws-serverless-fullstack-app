import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { TransactionForm } from "../TransactionForm";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import type { Transaction } from "@/features/transactions/types/transaction";
import type { UseOverlayStateReturn } from "@heroui/react";

const mockCreateMutate = vi.fn();
const mockUpdateMutate = vi.fn();

vi.mock("@/features/transactions/api/useCreateTransaction", () => ({
  useCreateTransaction: () => ({
    mutate: mockCreateMutate,
    isPending: false,
  }),
}));

vi.mock("@/features/transactions/api/useUpdateTransaction", () => ({
  useUpdateTransaction: () => ({
    mutate: mockUpdateMutate,
    isPending: false,
  }),
}));

const makeDialogState = (
  overrides?: Partial<UseOverlayStateReturn>,
): UseOverlayStateReturn => ({
  isOpen: false,
  open: vi.fn(),
  close: vi.fn(),
  toggle: vi.fn(),
  setOpen: vi.fn(),
  ...overrides,
});

interface WrapperOptions {
  selectedTransaction?: Transaction | null;
}

const sampleTransaction: Transaction = {
  id: "tx-1",
  description: "Grocery shopping",
  amount: 42.5,
  category: "Food",
  type: "income",
  sourceAccount: "Checking",
  createdAt: new Date("2024-01-15T00:00:00.000Z"),
};

function buildContextValue(opts: WrapperOptions = {}) {
  const { selectedTransaction = null } = opts;
  return {
    dialogState: makeDialogState(),
    selectedTransaction,
    setSelectedTransaction: vi.fn(),
    deleteDialogState: makeDialogState(),
    transactionToDelete: null,
    setTransactionToDelete: vi.fn(),
  };
}

function renderForm(opts: WrapperOptions = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const contextValue = buildContextValue(opts);

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <TransactionContext.Provider value={contextValue}>
        {children}
      </TransactionContext.Provider>
    </QueryClientProvider>
  );

  const result = render(<TransactionForm />, { wrapper: Wrapper });
  return { ...result, contextValue };
}

describe("TransactionForm", () => {
  beforeEach(() => {
    mockCreateMutate.mockReset();
    mockUpdateMutate.mockReset();
  });

  describe("create mode (no selectedTransaction)", () => {
    it("shows 'New Transaction' heading", () => {
      renderForm();
      expect(screen.getByText("New Transaction")).toBeInTheDocument();
    });

    it("renders all required form fields", () => {
      renderForm();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /amount/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/source account/i)).toBeInTheDocument();
    });

    it("renders Income and Expense toggle buttons", () => {
      renderForm();
      expect(
        screen.getByRole("radio", { name: /income/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("radio", { name: /expense/i }),
      ).toBeInTheDocument();
    });

    it("defaults the type toggle to Expense", () => {
      renderForm();
      const expenseBtn = screen.getByRole("radio", { name: /expense/i });
      expect(expenseBtn).toHaveAttribute("aria-checked", "true");
    });

    it("renders Save and Cancel buttons", () => {
      renderForm();
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });
  });

  describe("edit mode (selectedTransaction provided)", () => {
    it("shows 'Edit Transaction' heading", () => {
      renderForm({ selectedTransaction: sampleTransaction });
      expect(screen.getByText("Edit Transaction")).toBeInTheDocument();
    });

    it("pre-fills description from selectedTransaction", () => {
      renderForm({ selectedTransaction: sampleTransaction });
      expect(screen.getByDisplayValue("Grocery shopping")).toBeInTheDocument();
    });

    it("pre-fills category from selectedTransaction", () => {
      renderForm({ selectedTransaction: sampleTransaction });
      expect(screen.getByDisplayValue("Food")).toBeInTheDocument();
    });

    it("pre-fills sourceAccount from selectedTransaction", () => {
      renderForm({ selectedTransaction: sampleTransaction });
      expect(screen.getByDisplayValue("Checking")).toBeInTheDocument();
    });

    it("selects the correct type toggle for the existing transaction", () => {
      renderForm({ selectedTransaction: sampleTransaction }); // type = "income"
      expect(screen.getByRole("radio", { name: /income/i })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });
  });

  describe("form submission in create mode", () => {
    it("calls createMutate with FormData containing the entered values", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.clear(screen.getByLabelText(/description/i));
      await user.type(screen.getByLabelText(/description/i), "Coffee run");
      await user.clear(screen.getByLabelText(/category/i));
      await user.type(screen.getByLabelText(/category/i), "Food");
      await user.clear(screen.getByLabelText(/source account/i));
      await user.type(screen.getByLabelText(/source account/i), "Cash");

      await user.click(screen.getByRole("button", { name: /save/i }));

      await waitFor(() => expect(mockCreateMutate).toHaveBeenCalledTimes(1));
      const formDataArg: FormData = mockCreateMutate.mock.calls[0][0];
      expect(formDataArg.get("description")).toBe("Coffee run");
      expect(formDataArg.get("category")).toBe("Food");
      expect(formDataArg.get("sourceAccount")).toBe("Cash");
      expect(formDataArg.get("type")).toBe("expense");
    });

    it("does not call updateMutate in create mode", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.clear(screen.getByLabelText(/description/i));
      await user.type(screen.getByLabelText(/description/i), "Valid desc");
      await user.clear(screen.getByLabelText(/category/i));
      await user.type(screen.getByLabelText(/category/i), "Work");
      await user.clear(screen.getByLabelText(/source account/i));
      await user.type(screen.getByLabelText(/source account/i), "Card");

      await user.click(screen.getByRole("button", { name: /save/i }));

      await waitFor(() => expect(mockCreateMutate).toHaveBeenCalledTimes(1));
      expect(mockUpdateMutate).not.toHaveBeenCalled();
    });
  });

  describe("form submission in edit mode", () => {
    it("calls updateMutate with the transaction id and updated FormData", async () => {
      const user = userEvent.setup();
      renderForm({ selectedTransaction: sampleTransaction });

      const descInput = screen.getByLabelText(/description/i);
      await user.clear(descInput);
      await user.type(descInput, "Updated description");

      await user.click(screen.getByRole("button", { name: /save/i }));

      await waitFor(() => expect(mockUpdateMutate).toHaveBeenCalledTimes(1));
      const { id, formData } = mockUpdateMutate.mock.calls[0][0] as {
        id: string;
        formData: FormData;
      };
      expect(id).toBe("tx-1");
      expect(formData.get("description")).toBe("Updated description");
    });

    it("does not call createMutate in edit mode", async () => {
      const user = userEvent.setup();
      renderForm({ selectedTransaction: sampleTransaction });

      await user.click(screen.getByRole("button", { name: /save/i }));

      await waitFor(() => expect(mockUpdateMutate).toHaveBeenCalledTimes(1));
      expect(mockCreateMutate).not.toHaveBeenCalled();
    });
  });

  describe("validation", () => {
    it("shows a validation error when description is fewer than 3 characters", async () => {
      const user = userEvent.setup();
      renderForm();

      const descInput = screen.getByLabelText(/description/i);
      await user.clear(descInput);
      await user.type(descInput, "ab");
      await user.click(screen.getByRole("button", { name: /save/i }));

      await waitFor(() =>
        expect(
          screen.getByText(/description must be at least 3 characters/i),
        ).toBeInTheDocument(),
      );
      expect(mockCreateMutate).not.toHaveBeenCalled();
    });

    it("does not show a validation error when description is 3 or more characters", async () => {
      const user = userEvent.setup();
      renderForm();

      const descInput = screen.getByLabelText(/description/i);
      await user.clear(descInput);
      await user.type(descInput, "abc");
      await user.clear(screen.getByLabelText(/category/i));
      await user.type(screen.getByLabelText(/category/i), "Cat");
      await user.clear(screen.getByLabelText(/source account/i));
      await user.type(screen.getByLabelText(/source account/i), "Acc");

      await user.click(screen.getByRole("button", { name: /save/i }));

      await waitFor(() => expect(mockCreateMutate).toHaveBeenCalledTimes(1));
      expect(
        screen.queryByText(/description must be at least 3 characters/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("cancel button", () => {
    it("calls dialogState.close and setSelectedTransaction(null) when cancelled", async () => {
      const user = userEvent.setup();
      const { contextValue } = renderForm();

      await user.click(screen.getByRole("button", { name: /cancel/i }));

      expect(contextValue.dialogState.close).toHaveBeenCalledTimes(1);
      expect(contextValue.setSelectedTransaction).toHaveBeenCalledWith(null);
    });
  });

  describe("type toggle buttons", () => {
    it("can switch selection from Expense to Income", async () => {
      const user = userEvent.setup();
      renderForm();

      const incomeBtn = screen.getByRole("radio", { name: /income/i });
      await user.click(incomeBtn);

      expect(incomeBtn).toHaveAttribute("aria-checked", "true");
    });

    it("appends the selected type value to the FormData on submit", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByRole("radio", { name: /income/i }));

      await user.clear(screen.getByLabelText(/description/i));
      await user.type(screen.getByLabelText(/description/i), "Salary payment");
      await user.clear(screen.getByLabelText(/category/i));
      await user.type(screen.getByLabelText(/category/i), "Job");
      await user.clear(screen.getByLabelText(/source account/i));
      await user.type(screen.getByLabelText(/source account/i), "Bank");

      await user.click(screen.getByRole("button", { name: /save/i }));

      await waitFor(() => expect(mockCreateMutate).toHaveBeenCalledTimes(1));
      const formDataArg: FormData = mockCreateMutate.mock.calls[0][0];
      expect(formDataArg.get("type")).toBe("income");
    });
  });
});
