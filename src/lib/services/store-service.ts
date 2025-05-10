import {
  Configuration,
  TenantApi,
  type TenantControllerCreateRequest,
  type TenantControllerUpdateConfigRequest,
} from "@/gen"
import { useLogto } from "@logto/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

const createApiClient = (accessToken: string) =>
  new TenantApi(new Configuration({ basePath: API_URL, accessToken }))

const useTenantsService = () => {
  const logto = useLogto()

  const getClient = async () => {
    console.log("Logto is authenticated:", logto)

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

export const useGetStores = () => {
  const { getClient } = useTenantsService()

  return useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const client = await getClient()
      return client.tenantControllerGetMyTenants()
    },
  })
}

// GET tenant by ID (client-side filtering)
export const useGetStoreById = (id: string) => {
  const { getClient } = useTenantsService()

  return useQuery({
    queryKey: ["store", id],
    queryFn: async () => {
      const client = await getClient()
      const stores = await client.tenantControllerGetMyTenants()
      const store = stores.find((s) => s.id === id)
      if (!store) throw new Error("Loja não encontrada")
      return store
    },
    enabled: !!id,
  })
}

export const useCreateStore = () => {
  const { getClient } = useTenantsService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TenantControllerCreateRequest) => {
      const client = await getClient()
      return client.tenantControllerCreate(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] })
    },
  })
}

export const useUpdateStoreConfig = () => {
  const { getClient } = useTenantsService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TenantControllerUpdateConfigRequest) => {
      const client = await getClient()
      return client.tenantControllerUpdateConfig(data)
    },
    onSuccess: async (_, payload) => {
      await queryClient.invalidateQueries({ queryKey: ["stores"] })
    },
  })
}

export const useGetStoreStats = (storeId: string) => {
  return useQuery({
    queryKey: ["storeStats", storeId],
    queryFn: async () => {
      console.log("Fetching store stats for storeId:", storeId)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            totalCustomers: 42,
            newCustomersThisMonth: 5,
            totalSales: 12580.5,
            salesThisMonth: 2340.75,
            totalPointsRedeemed: 3750,
            redeemedThisMonth: 850,
            activePoints: 5280,
            pointsEarnedThisMonth: 1240,
          })
        }, 800)
      })
    },
    enabled: !!storeId,
  })
}
