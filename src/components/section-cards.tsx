import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { GetTransactionsStatsResponse } from "@/gen";
import { BadgeCheck, Gift, TrendingDown, TrendingUp } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type SectionCardsProps = {
  isLoading: boolean
  transactionStats?: GetTransactionsStatsResponse
}

export function SectionCards(props: SectionCardsProps) {
  if (props.isLoading) {
    return <SectionCardsSkeleton />
  }
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de clientes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4382
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pontos liberados</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {props.transactionStats?.earnedPoints}
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <TrendingDown />
              -20%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Acúmulo contínuo de pontos <BadgeCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total de pontos distribuídos aos clientes até o momento.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pontos resgatados</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {props.transactionStats?.redeemedPoints}
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +12.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Engajamento com recompensas <Gift className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total de pontos utilizados em resgates no programa de fidelidade.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pontos disponíveis</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {props.transactionStats?.availablePoints}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Saldo pronto para resgate <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">  Total de pontos disponíveis para os clientes no momento.</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pontos vencidos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {props.transactionStats?.expiredPoints}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pontos expirados sem uso <TrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Reflete oportunidades não aproveitadas pelos clientes.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export function SectionCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <CardDescription>
              <Skeleton className="h-4 w-32" />
            </CardDescription>
            <CardTitle>
              <Skeleton className="h-7 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-4 w-48 mb-1" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}