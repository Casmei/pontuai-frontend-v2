import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useGetCustomerBalanceStats,
  useGetCustomerDetail,
  useGetCustomerTransactions,
} from "@/lib/services/customer-service"

import { CustomerDetails } from "@/components/customer/CustomerDetails"

import { CustomerHeader } from "@/components/customer/CustomerHeader"
import { RecentActivity } from "@/components/customer/RecentActivity"
import { CustomerPoints } from "@/components/customer/CustomerPoints"
import { CustomerActions } from "@/components/customer/CustomerActions"
import { useGetRewards } from "@/lib/services/reward-service"
import { AvailableRewards } from "@/components/customer/AvailableRewards"

export const Route = createFileRoute("/stores/$storeId/customers/$customerId/")({
  component: CustomerDetailPage,
})

function CustomerDetailPage() {
  const { storeId, customerId } = Route.useParams()

  const {
    data: customer,
    isError: _,
    isLoading: customerLoading,
  } = useGetCustomerDetail({
    xTenantId: storeId,
    customerId,
  })

  const {
    data: customerTransactions,
    isError: customerTransactionsError,
    isLoading: customerTransactionsLoading,
  } = useGetCustomerTransactions(
    {
      limit: 5,
      xTenantId: storeId,
      customerId,
    },
    {
      staleTime: 2 * 60 * 1000,
    },
  )

  const {
    data: customerBalanceStats,
    isLoading: customerBalanceStatsLoading,
  } = useGetCustomerBalanceStats(
    {
      xTenantId: storeId,
      customerId,
    },
    {
      staleTime: 2 * 60 * 1000,
    },
  )

  const { data: rewards } = useGetRewards({ xTenantId: storeId })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/stores/$storeId/customers" params={{ storeId }}>
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar a listagem
          </Button>
        </Link>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <CustomerHeader customer={customer} isLoading={customerLoading} />

            <CustomerActions customer={customer} rewards={rewards} storeId={storeId} points={customerBalanceStats?.points} />
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <CustomerDetails customer={customer} isLoading={customerLoading} />

              <CustomerPoints
                balanceStats={customerBalanceStats}
                isLoading={customerBalanceStatsLoading}
              />

              <RecentActivity
                customerTransactions={customerTransactions}
                isError={customerTransactionsError}
                isLoading={customerTransactionsLoading}
              />
            </div>
          </div>
        </div>
      </div>

      <AvailableRewards
        customer={customer}
        points={customerBalanceStats?.points}
        rewards={rewards!}
        isLoading={false}
      />
    </div>
  )
}
