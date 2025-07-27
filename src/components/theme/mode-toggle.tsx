import { Moon, Sun, Monitor, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme/theme-provider"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {/* Show icon based on current theme */}
                    <Sun
                        className={
                            `h-[1.2rem] w-[1.2rem] transition-all ` +
                            (theme === "light"
                                ? "scale-100 rotate-0"
                                : "scale-0 -rotate-90")
                        }
                    />
                    <Moon
                        className={
                            `absolute h-[1.2rem] w-[1.2rem] transition-all ` +
                            (theme === "dark"
                                ? "scale-100 rotate-0"
                                : "scale-0 rotate-90")
                        }
                    />
                    <Monitor
                        className={
                            `absolute h-[1.2rem] w-[1.2rem] transition-all ` +
                            (theme === "system"
                                ? "scale-100 rotate-0"
                                : "scale-0 rotate-90")
                        }
                    />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    {theme === "light" && (
                        <Check className="h-3 w-3 text-primary" />
                    )}
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    {theme === "dark" && (
                        <Check className="h-3 w-3 text-primary" />
                    )}
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    {theme === "system" && (
                        <Check className="h-3 w-3 text-primary" />
                    )}
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}