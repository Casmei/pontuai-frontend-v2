import { getRewards } from "@/lib/services/reward-service"
import { RewardCard } from "@/components/reward-card"

interface RewardListProps {
  storeId: string
}

export async function RewardList({ storeId }: RewardListProps) {
  const [err, rewards] = await getRewards({ xTenantId: storeId });

  if (err) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-lg font-semibold">Erro ao buscar prêmios</h2>
        <p className="text-sm text-muted-foreground mt-2">{err.message}</p>
      </div>
    )
  }

  if (rewards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-lg font-semibold">Nenhum prêmio encontrado</h2>
        <p className="text-sm text-muted-foreground mt-2">Crie seu primeiro prêmio para começar no formulário a cima!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rewards.map((reward) => (
        <RewardCard key={reward.id} reward={reward} />
      ))}
    </div>
  )
}
