import { Configuration, CustomerApi, CustomerControllerCreateRequest, CustomerControllerGetAllRequest, CustomerControllerGetCustomerDetailRequest } from "@/gen"
import { useLogto } from "@logto/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

const createApiClient = (accessToken: string) =>
  new CustomerApi(new Configuration({ basePath: API_URL, accessToken }))

const useCustomerService = () => {
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

export function useGetCustomers({ xTenantId, query }: CustomerControllerGetAllRequest) {

  const { getClient } = useCustomerService();

  return useQuery({
    queryKey: ["customer", query],
    queryFn: async () => {
      const client = await getClient()
      return client.customerControllerGetAll({ xTenantId, query })
    },
  })
}

export function useGetCustomerDetail({ xTenantId, customerId }: CustomerControllerGetCustomerDetailRequest) {

  const { getClient } = useCustomerService();

  return useQuery({
    queryKey: ["customer"],
    queryFn: async () => {
      const client = await getClient()
      return client.customerControllerGetCustomerDetail({ xTenantId, customerId })
    },
  })
}


export function useCreateCustomer() {
  const { getClient } = useCustomerService();
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CustomerControllerCreateRequest) => {
      const client = await getClient();
      return client.customerControllerCreate(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['customer'] });
    },
    onError: (error) => {
      console.error('Falha ao criar cliente:', error);
    },
  });
}

