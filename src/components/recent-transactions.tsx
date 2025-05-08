import { formatDate, formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentTransactionsProps {
  storeId: string
  limit?: number
}

export async function RecentTransactions({ storeId, limit = 5 }: RecentTransactionsProps) {
  const transactions: any[] = []

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma transação registrada ainda.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="font-medium">{transaction.customer.name}</p>
                <div className="flex items-center gap-2">
                  {transaction.type === "purchase" ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Compra
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Resgate
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</span>
                </div>
              </div>
              <div className="text-right">
                {transaction.type === "purchase" ? (
                  <>
                    <p className="text-green-600">+{transaction.pointsEarned} pts</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(transaction.amount!)}</p>
                  </>
                ) : (
                  <>
                    <p className="text-blue-600">-{transaction.pointsSpent} pts</p>
                    <p className="text-xs text-muted-foreground">{transaction.reward?.name}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
