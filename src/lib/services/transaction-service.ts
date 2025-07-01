import {
  Configuration,
  ResponseError,
  TransactionApi,
  type TransactionControllerCreateRequest,
  type TransactionControllerGetStatsRequest,
  type TransactionControllerRedeemRequest,
} from "@/gen"
import { useLogto } from "@logto/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL
const RESOURCE = "https://pontuai-api.kontact.com.br"

const createApiClient = (accessToken: string) =>
  new TransactionApi(
    new Configuration({
      basePath: API_URL,
      accessToken,
    }),
  )

const useTransactionsService = () => {
  const logto = useLogto()

  const getClient = async () => {
    if (!logto.isAuthenticated) {
      throw new Error("Logto não autenticado")
    }

    const token = await logto.getAccessToken(RESOURCE)
    if (!token) {
      throw new Error("Token não encontrado")
    }

    return createApiClient(token)
  }

  return { getClient, isAuthenticated: logto.isAuthenticated }
}

// biome-ignore lint/suspicious/noExplicitAny: TODO: Entender por que n estou conseguindo exportar o tipo aqui
export const useGetTransactions = (params: any) => {
  const { getClient } = useTransactionsService()

  return useQuery({
    queryKey: ["transactions", params],
    queryFn: async () => {
      const client = await getClient()
      return client.transactionControllerGetAll(params)
    },
    enabled: !!params,
  })
}

export const useGetTransactionsStats = (params: TransactionControllerGetStatsRequest) => {
  const { getClient } = useTransactionsService()

  return useQuery({
    queryKey: ["transactions-stats", params],
    queryFn: async () => {
      const client = await getClient()
      return client.transactionControllerGetStats(params)
    },
    enabled: !!params,
  })
}

export function useCreateTransaction() {
  const { getClient } = useTransactionsService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TransactionControllerCreateRequest) => {
      const client = await getClient()
      return client.transactionControllerCreate(data)
    },
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          `transaction-${variables.addPointsDto.customerId}`,
          `balance-${variables.addPointsDto.customerId}`,
        ],
      })

      toast.success("Transação criada", {
        description: "A transação foi criada com sucesso! 🎉",
      })
    },
    onError: async (err) => {
      if (err instanceof ResponseError) {
        const json = await err.response.json()

        toast.error("Erro", {
          description: json.message,
        })
      } else {
        console.error("Erro desconhecido:", err)
      }
    },
  })
}

export function useRedeemReward() {
  const { getClient } = useTransactionsService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, redeemRewardDto, xTenantId }: TransactionControllerRedeemRequest) => {
      const client = await getClient()
      return client.transactionControllerRedeem({ id, redeemRewardDto, xTenantId })
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [
          `transaction-${variables.redeemRewardDto.customerId}`,
          `balance-${variables.redeemRewardDto.customerId}`,
        ],
      })

      toast.success("Prêmio resgatado", {
        description: "O prêmio foi resgatado com sucesso! 🎉",
      })
    },
    onError: async (err) => {
      if (err instanceof ResponseError) {
        const json = await err.response.json()

        toast.error("Erro", {
          description: json.message,
        })
      } else {
        console.error("Erro desconhecido:", err)
      }
    },
  })
}
