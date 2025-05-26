import {
  Configuration,
  CustomerApi,
  CustomerControllerCreateRequest,
  CustomerControllerGetAllRequest,
  CustomerControllerGetCustomerDetailRequest,
  CustomerControllerGetCustomerTransactionDetailRequest,
  ResponseError,
} from "@/gen";
import { useLogto } from "@logto/react";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const createApiClient = (accessToken: string) =>
  new CustomerApi(new Configuration({ basePath: API_URL, accessToken }));

const useCustomerService = () => {
  const logto = useLogto();

  const getClient = async () => {

    if (!logto.isAuthenticated) {
      throw new Error("Logto não autenticado");
    }

    const token = await logto.getAccessToken(
      "https://pontuai-api.kontact.com.br"
    );

    if (!token) {
      throw new Error("Token não encontrado");
    }

    return createApiClient(token);
  };

  return { getClient, isAuthenticated: logto.isAuthenticated };
};

export function useGetCustomers({
  xTenantId,
  query,
  limit,
  page
}: CustomerControllerGetAllRequest) {
  const { getClient } = useCustomerService();

  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ["customer", query, page, xTenantId],
    queryFn: async () => {
      const client = await getClient();
      return client.customerControllerGetAll({ xTenantId, query, limit, page });
    },
  });
}

export function useGetCustomerDetail(
  { xTenantId, customerId }: CustomerControllerGetCustomerDetailRequest,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  const { getClient } = useCustomerService();

  return useQuery({
    queryKey: ["customer", customerId],
    enabled: options?.enabled,
    staleTime: options?.staleTime,
    queryFn: async () => {
      const client = await getClient();
      return client.customerControllerGetCustomerDetail({
        xTenantId,
        customerId,
      });
    },
  });
}

export function useGetCustomerTransactionDetail(
  {
    xTenantId,
    customerId,
  }: CustomerControllerGetCustomerTransactionDetailRequest,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  const { getClient } = useCustomerService();

  return useQuery({
    enabled: options?.enabled,
    staleTime: options?.staleTime,
    queryKey: [customerId],
    queryFn: async () => {
      const client = await getClient();
      return client.customerControllerGetCustomerTransactionDetail({
        xTenantId,
        customerId,
      });
    },
  });
}

export function useCreateCustomer() {
  const { getClient } = useCustomerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CustomerControllerCreateRequest) => {
      const client = await getClient();
      return client.customerControllerCreate(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customer"] });
      toast.success("Cliente adicionado", {
        description: "O cliente foi adicionado com sucesso.",
      })
    },
    onError: async (err) => {
      if (err instanceof ResponseError) {
        const json = await err.response.json();

        toast.error("Erro", {
          description: json.message,
        });
      } else {
        console.error("Erro desconhecido:", err);
      }
    },
  });
}
