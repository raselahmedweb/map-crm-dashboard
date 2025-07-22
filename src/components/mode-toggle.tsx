import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <div className="w-full">
      {theme === "light" ? (
        <button
          onClick={() => setTheme("dark")}
          className="flex w-full items-center gap-2"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </button>
      ) : (
        <button
          onClick={() => setTheme("light")}
          className="flex w-full items-center gap-2"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </button>
      )}
    </div>
  );
}
