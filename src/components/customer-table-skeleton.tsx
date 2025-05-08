import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableCell,
  TableRow,
} from "@/components/ui/table"

export function CustomerTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <TableRow className="" key={i}>
          <TableCell>
            <Skeleton className="h-4 w-[120px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[60px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[80px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-[60px]" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
