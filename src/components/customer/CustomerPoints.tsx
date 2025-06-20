import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePercent } from "lucide-react";
import { CustomerPointsSkeleton } from "@/components/customer-detail";
import type { GetCustomerBalanceStatsResponse } from '@/gen';

type CustomerPointsProps = {
    balanceStats?: GetCustomerBalanceStatsResponse;
    isLoading: boolean;
};

export function CustomerPoints({ balanceStats, isLoading }: CustomerPointsProps) {
    if (isLoading) {
        return <CustomerPointsSkeleton />;
    }

    if (!balanceStats) {
        return null;
    }

    return (
        <Card className="md:col-span-2">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-md">Pontos</CardTitle>
                <p className="text-4xl font-bold text-primary">
                    {balanceStats.points}
                </p>
            </CardHeader>

            <CardContent className="flex flex-col justify-between flex-1">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                            Detalhes dos pontos
                        </p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span>Ganhados (ao todo)</span>
                                <span className="font-medium text-green-600">
                                    +{balanceStats.earnedPoints}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span>Resgatados (ao todo)</span>
                                <span className="font-medium text-yellow-600">
                                    -{balanceStats.redeemedPoints}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span>Expirados (ao todo)</span>
                                <span className="font-medium text-red-600">
                                    -{balanceStats.expiredPoints}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
