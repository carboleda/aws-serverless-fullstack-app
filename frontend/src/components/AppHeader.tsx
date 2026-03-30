import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { PiMoonBold, PiSunBold } from "react-icons/pi";

export const AppHeader = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <span className="text-foreground font-bold text-lg tracking-tight">
          Guru Finance
        </span>

        <Button
          isIconOnly
          size="sm"
          variant="tertiary"
          onPress={toggleTheme}
          aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {resolvedTheme === "dark" ? (
            <PiSunBold className="size-4" />
          ) : (
            <PiMoonBold className="size-4" />
          )}
        </Button>
      </div>
    </header>
  );
};
