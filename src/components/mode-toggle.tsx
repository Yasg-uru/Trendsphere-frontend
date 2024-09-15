import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme(); // Get current theme and setter

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {/* Sun and Moon Icon Animation for Light/Dark Mode */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Light Mode Toggle */}
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-muted" : ""}
        >
          Light
        </DropdownMenuItem>

        {/* Dark Mode Toggle */}
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-muted" : ""}
        >
          Dark
        </DropdownMenuItem>

        {/* System Mode Toggle */}
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={theme === "system" ? "bg-muted" : ""}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
