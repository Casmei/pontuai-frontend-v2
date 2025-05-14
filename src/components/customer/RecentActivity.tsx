import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Gift } from "lucide-react";
import { RecentActivitySkeleton } from "@/components/customer-detail";
import { GetCustomerTransactionDetailResponse, TransactionResponse } from "@/gen";

type RecentActivityProps = {
    customerTransaction: GetCustomerTransactionDetailResponse;
    isLoading: boolean;
};

export function RecentActivity({
    customerTransaction,
    isLoading,
}: RecentActivityProps) {
    if (isLoading) {
        return <RecentActivitySkeleton />;
    }

    const hasTransactions = customerTransaction?.transactions?.length > 0;

    return (
        <Card className="md:col-span-3">
            <CardHeader>
                <CardTitle className="text-lg">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    {!hasTransactions ? (
                        <p className="text-sm text-muted-foreground text-center">
                            Nenhuma transação encontrada para este cliente.
                        </p>
                    ) : (
                        <TransactionList transactions={customerTransaction.transactions} />
                    )}
                </div>

                {hasTransactions && (
                    <Button variant="ghost" className="w-full text-sm">
                        Ver todas as transações
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

const TransactionList = React.memo(({ transactions = [] }: { transactions: TransactionResponse[] }) => {
    return (
        <>
            {transactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
        </>
    );
});

TransactionList.displayName = "TransactionList";

const TransactionItem = React.memo(({ transaction }: { transaction: TransactionResponse }) => {
    const isInput = transaction.type === "input";

    return (
        <div className="flex items-start gap-3">
            <div
                className={`mt-0.5 p-1.5 rounded-full ${isInput
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                    }`}
            >
                {isInput ? (
                    <ShoppingBag className="h-3 w-3" />
                ) : (
                    <Gift className="h-3 w-3" />
                )}
            </div>
            <div className="flex-1">
                <div className="flex justify-between">
                    <p className="text-sm font-medium">
                        {isInput ? "Compra" : "Resgate"}
                    </p>
                    <p
                        className={`text-sm font-medium ${transaction.points > 0 ? "text-green-600" : "text-amber-600"
                            }`}
                    >
                        {transaction.points} pts
                    </p>
                </div>
                <p className="text-xs text-muted-foreground">
                    {transaction.reward?.name || ""}
                </p>
            </div>
        </div>
    );
});

TransactionItem.displayName = "TransactionItem";
