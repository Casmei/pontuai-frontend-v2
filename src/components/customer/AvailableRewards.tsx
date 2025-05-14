import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LockIcon } from "lucide-react";
import { RewardListSkeleton } from "@/components/customer-detail";
import { CreateRewardResponse, GetCustomerDetailResponse } from '@/gen';

type AvailableRewardsProps = {
    customer: GetCustomerDetailResponse;
    rewards: CreateRewardResponse[]
    isLoading: boolean;
}


export function AvailableRewards({ customer, rewards, isLoading }: AvailableRewardsProps) {
    if (isLoading) {
        return <RewardListSkeleton />;
    }

    if (!customer || !rewards?.length) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Prêmios disponíveis</CardTitle>
                <CardDescription>
                    Prêmios que o cliente{" "}
                    <span className="text-primary font-semibold">
                        {customer?.name}
                    </span>{" "}
                    pode resgatar
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rewards.map((reward) => (
                        <RewardCard
                            key={reward.id}
                            reward={reward}
                            customerPoints={customer?.points || 0}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// Componente de Card de Recompensa extraído para melhor performance
const RewardCard = React.memo(({ reward, customerPoints }: {
    reward: CreateRewardResponse
    customerPoints: number
}) => {
    const canClaim = customerPoints >= reward.pointValue;
    const progressPercentage = Math.min(
        (customerPoints / reward.pointValue) * 100,
        100
    );
    const pointsNeeded = Math.max(reward.pointValue - customerPoints, 0);

    return (
        <div
            className={`border rounded-lg p-4 relative transition-opacity ${canClaim
                ? "border-primary/20 bg-primary/5"
                : "border-destructive/20 bg-muted/40 opacity-50"
                }`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-medium">{reward.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {reward.description || "Sem descrição"}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!canClaim && (
                        <LockIcon className="w-4 h-4 text-destructive" />
                    )}
                    <Badge variant="outline">
                        {reward.pointValue} pts
                    </Badge>
                </div>
            </div>

            <div className="mt-4">
                <div className="text-xs text-muted-foreground">
                    <div className="flex justify-between mb-1">
                        <span>Progresso</span>
                        <span>
                            {Math.floor(progressPercentage)}%
                        </span>
                    </div>
                    <Progress
                        value={progressPercentage}
                        className="h-1"
                    />
                    <p className="mt-1 text-center">
                        {pointsNeeded > 0
                            ? `Precisa de mais ${pointsNeeded} points`
                            : "Prêmio disponível 🎉"}
                    </p>
                </div>
            </div>
        </div>
    );
});

RewardCard.displayName = 'RewardCard';