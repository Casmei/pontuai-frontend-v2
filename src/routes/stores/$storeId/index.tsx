import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { useGetCustomerStats } from "@/lib/services/customer-service"
import { useGetTransactionsStats } from "@/lib/services/transaction-service"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/stores/$storeId/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { storeId } = Route.useParams()
  const { data: transactionStats, isLoading } = useGetTransactionsStats({ xTenantId: storeId })
  const { data: customerStats, isLoading: customerIsLoading } = useGetCustomerStats({ xTenantId: storeId })

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards isLoading={isLoading || customerIsLoading} transactionStats={transactionStats} customerStats={customerStats} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive transactions={transactionStats?.transactions} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
