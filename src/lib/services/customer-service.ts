import { logtoConfig } from "@/config/logto";
import {
  Configuration,
  CustomerApi,
  CustomerControllerCreateRequest,
  CustomerControllerGetAllRequest,
} from "@/gen";
import { getAccessTokenRSC } from "@logto/next/server-actions";

const API_URL = process.env.API_URL;
const apiClient = new CustomerApi(
  new Configuration({
    basePath: API_URL,
    accessToken: async () => {
      return await getAccessTokenRSC(logtoConfig, logtoConfig.resources![0]);
    },
  })
);

export async function getCustomers(data: CustomerControllerGetAllRequest) {
  try {
    const response = await apiClient.customerControllerGetAll(data, {
      cache: "force-cache",
      next: { tags: [getCustomers.name] },
    });


    return [null, response] as const;
  } catch (e) {
    console.error(e);
    return [new Error("Falha ao buscar clientes"), null] as const;
  }
}

export async function getCustomerById(storeId: string, customerId: string) {
  return null;
}

export async function createCustomer(data: CustomerControllerCreateRequest) {
  try {
    const response = await apiClient.customerControllerCreate(data);
    return [null, response] as const;
  } catch (e) {
    console.error(e);
    return [new Error("Falha ao criar cliente"), null] as const;
  }
}

export async function updateCustomerPoints(
  storeId: string,
  customerId: string,
  points: number
) {
  return null;
}
