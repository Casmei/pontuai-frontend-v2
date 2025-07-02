import {
  Configuration,
  RewardApi,
  RewardControllerGetRewardStatsRequest,
  type RewardControllerAllRequest,
} from "@/gen"
import { useLogto } from "@logto/react"
import { useQuery } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

const createApiClient = (accessToken: string) =>
  new RewardApi(new Configuration({ basePath: API_URL, accessToken }))

const useRewardService = () => {
  const logto = useLogto()

  const getClient = async () => {
    if (!logto.isAuthenticated) {
      throw new Error("Logto não autenticado")
    }

    const token = await logto.getAccessToken("https://pontuai-api.kontact.com.br")

    if (!token) {
      throw new Error("Token não encontrado")
    }

    return createApiClient(token)
  }

  return { getClient, isAuthenticated: logto.isAuthenticated }
}

export function useGetRewards(
  { xTenantId }: RewardControllerAllRequest,
  options?: {
    enabled?: boolean
    staleTime?: number
  },
) {
  const { getClient } = useRewardService()

  return useQuery({
    enabled: options?.enabled,
    staleTime: options?.staleTime,
    queryKey: ["reward"],
    queryFn: async () => {
      const client = await getClient()
      return client.rewardControllerAll({ xTenantId })
    },
  })
}

export function useGetRewardStats(data: RewardControllerGetRewardStatsRequest) {
  const { getClient } = useRewardService()

  return useQuery({
    queryKey: ["reward-stats"],
    queryFn: async () => {
      const client = await getClient()
      return client.rewardControllerGetRewardStats(data)
    },
  })
}
