import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "@radix-ui/react-separator";

export function CustomerSkeleton() {
    return (
        <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center">
                <Skeleton className="h-20 w-20 rounded-full" />
            </div>

            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-48 rounded" />
                    <Skeleton className="h-5 w-12 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                </div>

                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-32 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-28 rounded" />
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                    <Skeleton className="h-5 w-20 rounded" />
                </div>
            </div>
        </div>
    );
}

export function CustomerDetailsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Detalhes do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                            <Skeleton className="h-4 w-24 mb-1" /> {/* Label */}
                            <Skeleton className="h-5 w-32" />       {/* Value */}
                        </div>
                    ))}
                </div>

                <Separator />

                <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-full max-w-md" />
                </div>

                <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <div className="flex flex-wrap gap-2 mt-1">
                        {[...Array(2)].map((_, i) => (
                            <Skeleton key={i} className="h-6 w-20 rounded" />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
