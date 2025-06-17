import {
  Configuration,
  CustomerApi,
  type CustomerControllerGetCustomerBalanceStatsRequest,
  type CustomerControllerGetCustomerTransactionsRequest,
  ResponseError,
  type CustomerControllerCreateRequest,
  type CustomerControllerGetAllRequest,
  type CustomerControllerGetCustomerDetailRequest,
} from "@/gen"
import { useLogto } from "@logto/react"
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

const createApiClient = (accessToken: string) =>
  new CustomerApi(new Configuration({ basePath: API_URL, accessToken }))

const useCustomerService = () => {
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

export function useGetCustomers({
  xTenantId,
  limit,
  page,
  search,
}: CustomerControllerGetAllRequest) {
  const { getClient } = useCustomerService()

  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ["customer", search, page, xTenantId],
    queryFn: async () => {
      const client = await getClient()
      return client.customerControllerGetAll({ xTenantId, search, limit, page })
    },
  })
}

export function useGetCustomerDetail(
  { xTenantId, customerId }: CustomerControllerGetCustomerDetailRequest,
  options?: {
    enabled?: boolean
    staleTime?: number
  },
) {
  const { getClient } = useCustomerService()

  return useQuery({
    queryKey: ["customer", customerId],
    enabled: options?.enabled,
    staleTime: options?.staleTime,
    queryFn: async () => {
      const client = await getClient()
      return client.customerControllerGetCustomerDetail({
        xTenantId,
        customerId,
      })
    },
  })
}

export function useGetCustomerTransactions(
  { xTenantId, customerId, limit }: CustomerControllerGetCustomerTransactionsRequest,
  options?: {
    enabled?: boolean
    staleTime?: number
  },
) {
  const { getClient } = useCustomerService()

  return useQuery({
    queryKey: [`transaction-${customerId}`],
    enabled: options?.enabled,
    staleTime: options?.staleTime,
    queryFn: async () => {
      const client = await getClient()
      return client.customerControllerGetCustomerTransactions({
        xTenantId,
        customerId,
        limit,
      })
    },
  })
}

export function useGetCustomerBalanceStats(
  { xTenantId, customerId }: CustomerControllerGetCustomerBalanceStatsRequest,
  options?: {
    enabled?: boolean
    staleTime?: number
  },
) {
  const { getClient } = useCustomerService()

  return useQuery({
    queryKey: [`balance-${customerId}`],
    enabled: options?.enabled,
    staleTime: options?.staleTime,
    queryFn: async () => {
      const client = await getClient()
      return client.customerControllerGetCustomerBalanceStats({
        xTenantId,
        customerId,
      })
    },
  })
}

export function useCreateCustomer() {
  const { getClient } = useCustomerService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CustomerControllerCreateRequest) => {
      const client = await getClient()
      return client.customerControllerCreate(data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customer"] })
      toast.success("Cliente adicionado", {
        description: "O cliente foi adicionado com sucesso.",
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
