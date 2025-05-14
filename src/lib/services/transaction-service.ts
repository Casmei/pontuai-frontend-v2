// src/lib/services/transactions-service.ts
import {
  Configuration,
  TransactionApi,
  type TransactionControllerCreateRequest,
  type TransactionControllerGetAllRequest,
} from "@/gen";
import { useLogto } from "@logto/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL; // mesmo env que Tenants
const RESOURCE = "https://pontuai-api.kontact.com.br"; // mesmo resource do Logto

const createApiClient = (accessToken: string) =>
  new TransactionApi(
    new Configuration({
      basePath: API_URL,
      accessToken,
    })
  );

const useTransactionsService = () => {
  const logto = useLogto();

  const getClient = async () => {
    if (!logto.isAuthenticated) {
      throw new Error("Logto não autenticado");
    }

    const token = await logto.getAccessToken(RESOURCE);
    if (!token) {
      throw new Error("Token não encontrado");
    }

    return createApiClient(token);
  };

  return { getClient, isAuthenticated: logto.isAuthenticated };
};

export const useGetTransactions = (
  params: TransactionControllerGetAllRequest
) => {
  const { getClient } = useTransactionsService();

  return useQuery({
    queryKey: ["transactions", params], // cache separado por filtros
    queryFn: async () => {
      const client = await getClient();
      return client.transactionControllerGetAll(params);
    },
    enabled: !!params, // só roda se params existir
  });
};

export function useCreateTransaction() {
  const { getClient } = useTransactionsService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TransactionControllerCreateRequest) => {
      const client = await getClient();
      return client.transactionControllerCreate(data);
    },
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.addPointsDto.customerId,
        ],
      });
    },
    onError: (error) => {
      console.error("Falha ao criar cliente:", error);
    },
  });
};
