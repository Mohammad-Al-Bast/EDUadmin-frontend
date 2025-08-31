import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function StudentDetailSkeleton() {
  return (
    <main className="">
      {/* Overview Section Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-6 w-24 mb-2" />

        <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-sm mb-4">
          {/* Student ID */}
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-5 w-16" />
          </div>
          {/* Campus */}
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-5 w-24" />
          </div>
          {/* Major */}
          <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <Skeleton className="h-5 w-32" />
          </div>
          {/* Year */}
          <div>
            <Skeleton className="h-4 w-10 mb-1" />
            <Skeleton className="h-5 w-8" />
          </div>
          {/* Student Name */}
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-5 w-40" />
          </div>
          {/* School */}
          <div>
            <Skeleton className="h-4 w-14 mb-1" />
            <Skeleton className="h-5 w-36" />
          </div>
          {/* Semester */}
          <div>
            <Skeleton className="h-4 w-18 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>

      {/* Register Courses Section Skeleton */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>

        {/* Course Card Skeleton */}
        <div className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent>
              {/* Course Selection Row Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Course Information Display Skeleton */}
              <div className="mt-6">
                <Skeleton className="h-5 w-36 mb-3" />
                <div className="grid grid-cols-4 gap-x-4 gap-y-3 text-sm">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Drop Courses Section Skeleton */}
      <div className="mb-6 mt-3">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>

        {/* Drop Course Card Skeleton */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent>
              {/* Course Selection Row Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comments/Reason Section Skeleton */}
      <div className="mb-6 mt-3">
        <Skeleton className="h-5 w-32 mb-3" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-24" />
      </div>
    </main>
  );
}
