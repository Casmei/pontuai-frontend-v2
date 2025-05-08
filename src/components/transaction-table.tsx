import { formatDate, formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getTransactions } from "@/lib/services/transaction-service";

interface TransactionTableProps {
  storeId: string
}

export async function TransactionTable({ storeId }: TransactionTableProps) {
  const [err, transactions] = await getTransactions({ xTenantId: storeId });

  if (err) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-lg font-semibold">Erro ao buscar transações</h2>
        <p className="text-sm text-muted-foreground mt-2">{err.message}</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">Nenhuma transação registrada</h3>
        <p className="text-sm text-muted-foreground mt-2">Registre transações usando o formulário acima.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Detalhes</TableHead>
            <TableHead>Pontos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.createdAt}</TableCell>
              <TableCell>{transaction.customer.name}</TableCell>
              <TableCell>
                {transaction.type === "input" ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Compra
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Resgate
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {transaction.type === "input" ? (
                  <span>{formatCurrency(Number(transaction.value))}</span>
                ) : (
                  <span>{transaction.reward?.name}</span>
                )}
              </TableCell>
              <TableCell>
                {transaction.type === "input" ? (
                  <span className="text-green-600">+{transaction.points}</span>
                ) : (
                  <span className="text-blue-600">-{transaction.reward?.pointValue}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
