import {
  Configuration,
  TenantApi,
  TenantControllerUpdateNotificationsRequest,
  type TenantControllerCreateRequest,
  type TenantControllerGetNotificationsRequest,
  type TenantControllerUpdateConfigRequest,
} from "@/gen"
import { useLogto } from "@logto/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

const createApiClient = (accessToken: string) =>
  new TenantApi(new Configuration({ basePath: API_URL, accessToken }))

const useTenantsService = () => {
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
      if (!store) {
        throw new Error("Loja não encontrada")
      }
      return store
    },
    enabled: !!id,
  })
}

export const useGetStoreNotifications = (data: TenantControllerGetNotificationsRequest) => {
  const { getClient } = useTenantsService()

  return useQuery({
    queryKey: ["store-notifications", data.xTenantId],
    queryFn: async () => {
      const client = await getClient()
      return client.tenantControllerGetNotifications(data)
    },
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

export const useUpdateStoreNotifications = () => {
  const { getClient } = useTenantsService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TenantControllerUpdateNotificationsRequest) => {
      const client = await getClient()
      return client.tenantControllerUpdateNotifications(data)
    },
    onSuccess: async (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["store-notifications", payload.xTenantId] })
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
