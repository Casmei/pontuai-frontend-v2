import { TrendingUp } from "lucide-react"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart"
import type { GetRewardStatsResponse } from "@/gen"
import { Skeleton } from "./ui/skeleton"



type Props = {
    data?: GetRewardStatsResponse[]
    isLoading: boolean
}

export function ChartPieRewardStats({ data, isLoading }: Props) {

    if (isLoading) {
        <ChartPieRewardStatsSkeleton />
    }

    const chartData = React.useMemo(() => {
        if (!data) { return [] }
        return data.map((item, index) => ({
            name: item.name,
            total: item.total,
            fill: `var(--chart-${(index % 5) + 1})`,
        }))
    }, [data])

    const chartConfig: ChartConfig = React.useMemo(() => {
        const config: ChartConfig = {}
        data?.forEach((item, index) => {
            config[item.name] = {
                label: item.name,
                color: `var(--chart-${(index % 5) + 1})`,
            }
        })
        return config
    }, [data])

    const totalCount = chartData.reduce((acc, curr) => acc + curr.total, 0)

    if (isLoading || !data) {
        return (
            <Card className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Carregando estatísticas...</p>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Resgates por Recompensa</CardTitle>
                <CardDescription>Totais por nome de prêmio</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="total"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalCount.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Total de {totalCount} resgates <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Dados atualizados para esta loja
                </div>
            </CardFooter>
        </Card>
    )
}


function ChartPieRewardStatsSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[250px]">
                <Skeleton className="rounded-full w-[180px] h-[180px]" />
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </CardFooter>
        </Card>
    )
}
