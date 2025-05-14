import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgePercent } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CustomerPointsSkeleton } from "@/components/customer-detail";
import { GetCustomerDetailResponse, GetCustomerTransactionDetailResponse } from '@/gen';

type CustomerPointsProps = {
    customer: GetCustomerDetailResponse;
    customerTransaction: GetCustomerTransactionDetailResponse;
    isLoading: boolean;
};

export function CustomerPoints({ customer, customerTransaction, isLoading }: CustomerPointsProps) {
    if (isLoading) {
        return <CustomerPointsSkeleton />;
    }

    if (!customer) {
        return null;
    }

    return (
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="text-lg">Pontos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between flex-1">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Nível Atual
                            </p>
                            <div className="flex items-center">
                                <Badge
                                    variant="outline"
                                    className="mt-1 font-semibold"
                                >
                                    {customer?.tier || "Bronze"}
                                </Badge>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                                Pontos disponíveis
                            </p>
                            <p className="text-2xl font-bold text-primary">
                                {customer?.points || 0}
                            </p>
                        </div>
                    </div>

                    {/* Todo: mudar isso para uma outra chamada */}
                    {/* <PointsDetails
                        customerTransaction={customerTransaction}
                    /> */}
                </div>

                <div className="pt-2">
                    <Button disabled className="w-full">
                        <BadgePercent className="mr-2 h-4 w-4" />
                        Gerenciar Pontos
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Componente de detalhes de pontos extraído para melhor performance
const PointsDetails = React.memo(({ customerTransaction }: { customerTransaction: GetCustomerTransactionDetailResponse }) => {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium">
                Detalhes dos pontos
            </p>
            <div className="space-y-2">
                <PointItem
                    label="Ganhados (Ao todo)"
                    value={customerTransaction?.earnedPoints || 0}
                />
                <PointItem
                    label="Resgatados (Ao todo)"
                    value={customerTransaction?.redeemedPoints || 0}
                />
                <PointItem
                    label="Expirados (Ao todo)"
                    value={customerTransaction?.expiredPoints || 0}
                />
            </div>
        </div>
    );
});

PointsDetails.displayName = 'PointsDetails';

// Componente individual de item de pontos
const PointItem = React.memo(({ label, value }: { label: string, value: any }) => {
    return (
        <div className="flex justify-between items-center text-sm">
            <span>{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
});

PointItem.displayName = 'PointItem';