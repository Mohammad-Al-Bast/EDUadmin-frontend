import { Skeleton } from "@/components/ui/skeleton";

export function UsersTableSkeleton() {
    return (
        <div className="space-y-4">
            {/* Table header skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
            </div>

            {/* Table rows skeleton */}
            <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
