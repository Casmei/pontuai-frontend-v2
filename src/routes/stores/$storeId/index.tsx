import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ChartPieRewardStats } from "@/components/ChartPieRewardStats"
import { SectionCards } from "@/components/section-cards"
import { useGetCustomerStats } from "@/lib/services/customer-service"
import { useGetRewardStats } from "@/lib/services/reward-service"
import { useGetTransactionsStats } from "@/lib/services/transaction-service"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/stores/$storeId/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { storeId } = Route.useParams()
  const { data: transactionStats, isLoading } = useGetTransactionsStats({ xTenantId: storeId })
  const { data: customerStats, isLoading: customerIsLoading } = useGetCustomerStats({ xTenantId: storeId })
  const { data: rewardStats, isLoading: rewardIsLoading } = useGetRewardStats({ xTenantId: storeId })

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards isLoading={isLoading || customerIsLoading} transactionStats={transactionStats} customerStats={customerStats} />
        <div className="grid grid-cols-5 gap-4 px-4 lg:px-6">
          <div className="col-span-5 lg:col-span-4">
            <ChartAreaInteractive
              transactions={transactionStats?.transactions}
              isLoading={isLoading}
            />
          </div>
          <div className="col-span-5 lg:col-span-1">
            <ChartPieRewardStats
              data={rewardStats}
              isLoading={rewardIsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
