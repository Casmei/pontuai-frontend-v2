import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Gift } from "lucide-react";
import { RecentActivitySkeleton } from "@/components/customer-detail";
import type {
    CustomerTransactionsResponse,
    TransactionResponse,
} from "@/gen";
import { formatDate } from "@/lib/utils";

type RecentActivityProps = {
    customerTransactions?: CustomerTransactionsResponse;
    isLoading: boolean;
    isError: boolean;
};

export function RecentActivity({
    customerTransactions,
    isLoading,
    isError
}: RecentActivityProps) {

    if (isLoading && !customerTransactions?.data) {
        return <RecentActivitySkeleton />;
    }

    if (isError) {
        return <p className="text-sm text-red-500 text-center">Erro ao carregar atividades.</p>;
    }

    const transactions = customerTransactions?.data ?? [];
    const hasTransactions = transactions.length > 0;

    return (
        <Card className="md:col-span-3">
            <CardHeader>
                <CardTitle className="text-lg">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!hasTransactions ? (
                    <p className="text-sm text-muted-foreground text-center">
                        Nenhuma transação encontrada para este cliente.
                    </p>
                ) : (
                    <TransactionTable transactions={transactions} />
                )}

                {hasTransactions && (
                    <Button variant="outline" className="w-full text-sm">
                        Ver todas as {customerTransactions?.totalItems ?? ""} transações
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

const TransactionTable = React.memo(
    ({ transactions }: { transactions: TransactionResponse[] }) => {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10" />
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Recompensa</TableHead>
                        <TableHead className="text-right">Pontos</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TransactionRow key={transaction.id} transaction={transaction} />
                    ))}
                </TableBody>
            </Table>
        );
    }
);

TransactionTable.displayName = "TransactionTable";

const TransactionRow = React.memo(
    ({ transaction }: { transaction: TransactionResponse }) => {
        const isInput = transaction.type === "input";

        return (
            <TableRow>
                <TableCell>
                    <div
                        className={`p-1.5 rounded-full ${isInput ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}
                    >
                        {isInput ? (
                            <ShoppingBag className="h-3 w-3" />
                        ) : (
                            <Gift className="h-3 w-3" />
                        )}
                    </div>
                </TableCell>
                <TableCell>
                    <span className="text-sm font-medium">
                        {isInput ? "Compra" : "Resgate"}
                    </span>
                </TableCell>
                <TableCell>
                    <span className="text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className="text-sm text-muted-foreground">
                        {transaction.reward?.name || "-"}
                    </span>
                </TableCell>
                <TableCell className={`text-right font-medium ${isInput ? "text-green-600" : "text-amber-600"}`}>
                    {transaction.points} pts
                </TableCell>
            </TableRow>
        );
    }
);

TransactionRow.displayName = "TransactionRow";
