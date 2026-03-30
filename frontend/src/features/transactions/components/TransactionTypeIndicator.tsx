import {
  TransactionTypes,
  type TransactionType,
} from "@/features/transactions/types/transaction";
import { Chip } from "@heroui/react";
import type { PropsWithChildren } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

interface TransactionTypeIndicatorProps extends PropsWithChildren {
  type: TransactionType;
  withIcon?: boolean;
}

const typeStyles: Record<
  TransactionType,
  { color: "success" | "danger"; icon: React.ReactNode }
> = {
  [TransactionTypes.INCOME]: {
    color: "success",
    icon: <FaArrowUp className="size-2" />,
  },
  [TransactionTypes.EXPENSE]: {
    color: "danger",
    icon: <FaArrowDown className="size-2" />,
  },
};

export const TransactionTypeIndicator: React.FC<
  TransactionTypeIndicatorProps
> = ({ type, withIcon = false, children }) => {
  const { color, icon } = typeStyles[type];
  return (
    <Chip color={color} variant="soft">
      <Chip.Label className="flex flex-row items-center gap-1">
        {withIcon && icon}
        {children}
      </Chip.Label>
    </Chip>
  );
};
