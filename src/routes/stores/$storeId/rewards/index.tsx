import { RewardForm } from "@/components/reward-form"
import { RewardList } from "@/components/reward-list"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/stores/$storeId/rewards/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { storeId } = Route.useParams()
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Recompensas</h1>

      <div className="rounded-lg border p-4">
        <h2 className="text-xl font-semibold mb-4">Adicionar Recompensa</h2>
        <RewardForm storeId={storeId} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Catálogo de Recompensas</h2>
        <RewardList storeId={storeId} />
      </div>
    </div>
  )
}
