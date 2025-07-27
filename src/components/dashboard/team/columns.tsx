import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreVertical, ShieldBan, ShieldCheck, SquareAsterisk, Trash2 } from "lucide-react"

export type Member = {
    id: string
    name: string
    email: string
}

export const columns: ColumnDef<Member>[] = [
    {
        accessorKey: "id",
        header: "Member ID",
    },
    {
        accessorKey: "name",
        header: "Member Name",
    },
    {
        accessorKey: "email",
        header: "Email Address",
    },
    {
        id: "actions",
        cell: () => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <ShieldCheck className="h-4 w-4" />
                            Verify
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <SquareAsterisk className="h-4 w-4" />
                            Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ShieldBan className="h-4 w-4" />
                            Block
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive hover:text-destructive/90!">
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
