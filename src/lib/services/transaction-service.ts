import { Configuration, ResponseError, TransactionApi, TransactionControllerCreateRequest, TransactionControllerGetAllRequest } from "@/gen";
import { getAccessTokenRSC } from "@logto/next/server-actions";
import { logtoConfig } from "@/config/logto";

const API_URL = process.env.API_URL;
const apiClient = new TransactionApi(
  new Configuration({
    basePath: API_URL,
    accessToken: async () => {
      return await getAccessTokenRSC(logtoConfig, logtoConfig.resources![0]);
    },
  })
);

export async function getTransactions(data: TransactionControllerGetAllRequest) {
  try {
    const response = await apiClient.transactionControllerGetAll(data);
    return [null, response] as const;
  } catch (e) {
    console.error(e);
    return [new Error("Falha ao listar transações"), null] as const;
  }
}

export async function createTransaction(data: TransactionControllerCreateRequest) {
  try {
    const response = await apiClient.transactionControllerCreate(data);
    return [null, response] as const;
  } catch (error) {
    if (error instanceof ResponseError) {
      const responseBody = await error.response.json().catch(() => null);
      const message = responseBody?.message || "Erro na requisição da transação.";
      return [new Error(message), null];
    }

    return [new Error("Erro desconhecido ao criar transação."), null];
  }
}
