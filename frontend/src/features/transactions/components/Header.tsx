import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import { useSummary } from "@/features/transactions/hooks/useSummary";
import type { Transaction } from "@/features/transactions/types/transaction";
import { formatCurrency } from "@/utils/currency";
import { Button } from "@heroui/react";
import classNames from "classnames";
import { useContext, useState } from "react";
import {
  PiArrowDownLeftBold,
  PiArrowUpRightBold,
  PiPlusCircle,
} from "react-icons/pi";

interface HeaderProps {
  transactions: Transaction[];
}

export const Header: React.FC<HeaderProps> = ({ transactions }) => {
  const context = useContext(TransactionContext);
  const { netTotal, netChangePercent } = useSummary({ transactions });
  const [isVisible, setIsVisible] = useState(true);

  const handleNewTransaction = () => {
    context?.dialogState.open();
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden p-4 flex flex-col gap-6 bg-overview-gradient">
      <div className="flex items-center justify-between">
        <span className="text-white text-lg font-bold">Overview</span>

        <Button
          size="sm"
          variant="outline"
          className="text-white"
          onPress={() => setIsVisible((v) => !v)}
        >
          {isVisible ? "Show less" : "Show more"}
        </Button>
      </div>

      {/* Bottom row: balance + percentage + add button */}
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-3">
          <span
            className="text-white font-bold leading-none"
            style={{ fontSize: "clamp(2rem, 6vw, 3.25rem)" }}
          >
            {isVisible ? formatCurrency(netTotal) : "••••••"}
          </span>

          {isVisible && (
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={classNames("font-semibold text-sm", {
                  "text-green-400": netChangePercent > 0,
                  "text-red-400": netChangePercent <= 0,
                })}
              >
                {netChangePercent.toFixed(1)}%
              </span>
              <span
                className={classNames(
                  "inline-flex items-center justify-center w-5 h-5 rounded-full",
                  {
                    "bg-green-400": netChangePercent > 0,
                    "bg-red-400": netChangePercent <= 0,
                  },
                )}
              >
                {netChangePercent > 0 ? (
                  <PiArrowUpRightBold className="text-black text-xs" />
                ) : (
                  <PiArrowDownLeftBold className="text-black text-xs" />
                )}
              </span>
            </div>
          )}
        </div>

        <Button
          isIconOnly
          size="md"
          variant="outline"
          className="text-white"
          onPress={handleNewTransaction}
          aria-label="New transaction"
        >
          <PiPlusCircle />
        </Button>
      </div>
    </div>
  );
};
