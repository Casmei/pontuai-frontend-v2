import { RewardCard } from "@/components/reward-card"
import { useGetRewards } from "@/lib/services/reward-service"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

interface RewardListProps {
    storeId: string
}

export function RewardList({ storeId }: RewardListProps) {
    const { data, isLoading, error } = useGetRewards({ xTenantId: storeId })

    if (isLoading) {
        return <RewardListSkeleton />
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h2 className="text-lg font-semibold">Erro ao buscar prêmios</h2>
                <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            </div>
        )
    }

    if (data!.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h2 className="text-lg font-semibold">Nenhum prêmio encontrado</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    Crie seu primeiro prêmio para começar no formulário a cima!
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data!.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
            ))}
        </div>
    )
}

function RewardListSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-9 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
