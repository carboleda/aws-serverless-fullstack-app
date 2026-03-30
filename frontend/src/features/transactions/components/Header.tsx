import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import { useSummary } from "@/features/transactions/hooks/useSummary";
import type { Transaction } from "@/features/transactions/types/transaction";
import { formatCurrency } from "@/utils/currency";
import { Button } from "@heroui/react";
import { useContext, useState } from "react";
import { PiArrowUpRightBold, PiEyeBold, PiEyeSlashBold, PiPlusCircle } from "react-icons/pi";

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
    <div className="relative w-full rounded-2xl overflow-hidden p-6 flex flex-col gap-6 bg-radial-[at_70%_40%] from-violet-600 from-0% via-violet-900 via-35% to-[#0a0a0f]">
      <div className="flex items-center justify-between">
        <span className="text-white text-lg font-bold">Overview</span>

        <div className="flex items-center gap-2">
          {/* Eye toggle */}
          <Button
            isIconOnly
            size="sm"
            variant="outline"
            className="text-white"
            onPress={() => setIsVisible((v) => !v)}
            aria-label={isVisible ? "Hide balance" : "Show balance"}
          >
            {isVisible ? <PiEyeBold /> : <PiEyeSlashBold />}
          </Button>

          {/* Show less / Show more */}
          <Button
            size="sm"
            variant="outline"
            className="text-white"
            onPress={() => setIsVisible((v) => !v)}
          >
            {isVisible ? "Show less" : "Show more"}
          </Button>

          {/* New transaction */}
          <Button
            isIconOnly
            size="sm"
            variant="outline"
            className="text-white"
            onPress={handleNewTransaction}
            aria-label="New transaction"
          >
            <PiPlusCircle />
          </Button>
        </div>
      </div>

      {/* Bottom row: balance + percentage */}
      <div className="flex items-end gap-3">
        <span
          className="text-white font-bold leading-none"
          style={{ fontSize: "clamp(2rem, 6vw, 3.25rem)" }}
        >
          {isVisible ? formatCurrency(netTotal) : "••••••"}
        </span>

        {isVisible && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-green-400 font-semibold text-sm">
              {netChangePercent.toFixed(1)}%
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-400">
              <PiArrowUpRightBold className="text-black text-xs" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
