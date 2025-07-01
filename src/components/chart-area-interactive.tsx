import { format } from "date-fns"
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
    Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle,
} from "./ui/card"
import {
    ChartContainer, ChartTooltip, ChartTooltipContent,
} from "./ui/chart"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select"
import {
    ToggleGroup, ToggleGroupItem,
} from "./ui/toggle-group"

import type { TransactionResponse } from "@/gen/models/TransactionResponse"
import { Skeleton } from "./ui/skeleton"

interface ChartAreaInteractiveProps {
    transactions?: TransactionResponse[], isLoading: boolean
}

export function ChartAreaInteractive({ transactions, isLoading }: ChartAreaInteractiveProps) {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState("90d")

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d")
        }
    }, [isMobile])

    if (isLoading || !transactions) {
        return <ChartAreaSkeleton />
    }
    // Agrupar transações por data e tipo
    const dataMap = new Map<string, { input: number, output: number }>()

    for (const t of transactions) {
        const date = format(new Date(t.createdAt), "yyyy-MM-dd")
        const entry = dataMap.get(date) ?? { input: 0, output: 0 }

        if (t.type === "input") {
            entry.input += t.points
        } else if (t.type === "output") {
            entry.output += t.points
        }

        dataMap.set(date, entry)
    }

    const chartData = Array.from(dataMap.entries()).map(([date, { input, output }]) => ({
        date,
        input,
        output,
    }))

    // Filtrar por período selecionado
    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date()
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(referenceDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Transações</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">Entradas e Saídas</span>
                    <span className="@[540px]/card:hidden">Últimos dias</span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="90d">90 dias</ToggleGroupItem>
                        <ToggleGroupItem value="30d">30 dias</ToggleGroupItem>
                        <ToggleGroupItem value="7d">7 dias</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40 @[767px]/card:hidden" size="sm">
                            <SelectValue placeholder="Últimos dias" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d">90 dias</SelectItem>
                            <SelectItem value="30d">30 dias</SelectItem>
                            <SelectItem value="7d">7 dias</SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    className="aspect-auto h-[250px] w-full"
                    config={{
                        input: { label: "Entrada", color: "#22c55e" },  // verde
                        output: { label: "Saída", color: "#ef4444" },   // vermelho
                    }}
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillInput" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillOutput" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "short",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            defaultIndex={isMobile ? -1 : 10}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => new Date(value).toLocaleDateString("pt-BR")}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            type="monotone"
                            dataKey="input"
                            stroke="#22c55e"
                            fill="url(#fillInput)"
                            name="Entrada"
                        />
                        <Area
                            type="monotone"
                            dataKey="output"
                            stroke="#ef4444"
                            fill="url(#fillOutput)"
                            name="Saída"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export function ChartAreaSkeleton() {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-32" />
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-48" />
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-[250px] w-full rounded-lg" />
            </CardContent>
        </Card>
    )
}
