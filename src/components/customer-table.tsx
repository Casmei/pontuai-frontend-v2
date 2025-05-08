import { getCustomers } from "@/lib/services/customer-service"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash } from "lucide-react"

interface CustomerTableProps {
  storeId: string
  query: string
}

export async function CustomerTable({ storeId, query }: CustomerTableProps) {
  const [err, customers] = await getCustomers({ xTenantId: storeId, query })

  if (err) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-lg font-semibold">Erro ao buscar clientes</h2>
        <p className="text-sm text-muted-foreground mt-2">{err.message}</p>
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">Nenhum cliente cadastrado</h3>
        <p className="text-sm text-muted-foreground mt-2">Adicione clientes usando o formulário acima.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Pontos</TableHead>
            {/* <TableHead>Data de Cadastro</TableHead> */}
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map(({ customer, points }) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>
                <Badge variant="outline">{points} pts</Badge>
              </TableCell>
              {/* TODO */}
              {/* <TableCell>{formatDate(customer.createdAt)}</TableCell> */}
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
