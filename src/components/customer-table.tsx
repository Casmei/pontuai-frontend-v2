import { useState } from "react"
import { useGetCustomers } from "@/lib/services/customer-service"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash } from "lucide-react"
import { CustomerTableSkeleton } from "./customer-table-skeleton"
import { Link } from "@tanstack/react-router"
import { capitalizeName } from "@/lib/utils"

interface CustomerTableProps {
  storeId: string
  search: string
}

export function CustomerTable({ storeId, search }: CustomerTableProps) {
  const [page, setPage] = useState(1)
  const limit = 10

  const {
    data: response,
    isError: err,
    isLoading,
  } = useGetCustomers({ xTenantId: storeId, search, page, limit })

  const customers = response?.customers ?? []
  const totalPages = response?.totalPages ?? 1

  if (err) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-lg font-semibold">Erro ao buscar clientes</h2>
      </div>
    )
  }

  if (!isLoading && customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">Nenhum cliente cadastrado</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Adicione clientes usando o formulário acima.
        </p>
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
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <CustomerTableSkeleton />}
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{capitalizeName(customer.name)}</TableCell>
              <TableCell>{customer.phone}</TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Link
                    to="/stores/$storeId/customers/$customerId"
                    params={{ storeId, customerId: customer.id }}
                  >
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Visualizar</span>
                    </Button>
                  </Link>
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

      {/* Controles de Paginação */}
      <div className="flex justify-center items-center gap-2 p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          &larr;
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="icon"
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          &rarr;
        </Button>
      </div>
    </div>
  )
}
