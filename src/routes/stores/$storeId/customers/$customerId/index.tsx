import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetCustomerDetail,
  useGetCustomerTransactionDetail
} from "@/lib/services/customer-service";
import { useGetRewards } from "@/lib/services/reward-service";

// import { CustomerActions } from "@/components/customer/CustomerActions";
import { CustomerDetails } from "@/components/customer/CustomerDetails";
import { AvailableRewards } from "@/components/customer/AvailableRewards";


import {
  CustomerDetailsSkeleton,
  CustomerPointsSkeleton,
  RecentActivitySkeleton,
  RewardListSkeleton
} from "@/components/customer-detail";
import { RecentActivity } from "@/components/customer/RecentActivity";
import { CustomerHeader } from "@/components/customer/CustomerHeader";
import { CustomerPoints } from "@/components/customer/CustomerPoints";
import { CustomerActions } from "@/components/customer/CustomerActions";

export const Route = createFileRoute("/stores/$storeId/customers/$customerId/")({
  component: CustomerDetailPage,
});

function CustomerDetailPage() {
  const { storeId, customerId } = Route.useParams();

  // Queries com react-query otimizadas
  const {
    data: customer,
    isError: customerError,
    isLoading: customerLoading
  } = useGetCustomerDetail({
    xTenantId: storeId,
    customerId,
  });

  const {
    data: customerTransaction,
    isError: transactionError,
    isLoading: transactionLoading
  } = useGetCustomerTransactionDetail(
    {
      xTenantId: storeId,
      customerId,
    },
    {
      enabled: !!customer,
      staleTime: 2 * 60 * 1000
    }
  );

  const {
    data: rewards,
    isError: rewardsError,
    isLoading: rewardsLoading
  } = useGetRewards(
    {
      xTenantId: storeId,

    },
    {
      enabled: !!customer,
      staleTime: 10 * 60 * 1000,
    }
  );

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
            <CustomerHeader
              customer={customer!}
              isLoading={customerLoading}
            />

            <CustomerActions
              storeId={storeId}
              customer={customer!}
              rewards={rewards!}
            />
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {customerLoading && customer ? (
                <CustomerDetailsSkeleton />
              ) : (
                <CustomerDetails
                  customer={customer!}
                  isLoading={false}
                />
              )}

              {customerLoading || transactionLoading ? (
                <CustomerPointsSkeleton />
              ) : (
                <CustomerPoints
                  customer={customer!}
                  customerTransaction={customerTransaction!}
                  isLoading={false}
                />
              )}

              {customerLoading || (transactionLoading && customerTransaction) ? (
                <RecentActivitySkeleton />
              ) : (
                <RecentActivity
                  customerTransaction={customerTransaction!}
                  isLoading={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {customerLoading || rewardsLoading ? (
        <RewardListSkeleton />
      ) : customer && rewards && (
        <AvailableRewards
          customer={customer}
          rewards={rewards!}
          isLoading={false}
        />
      )}
    </div>
  );
}