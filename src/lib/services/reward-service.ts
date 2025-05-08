import { logtoConfig } from "@/config/logto";
import { Configuration, RewardApi, RewardControllerAllRequest, RewardControllerCreateRequest, RewardControllerRedeemRequest } from "@/gen";
import { getAccessTokenRSC } from "@logto/next/server-actions";

const API_URL = process.env.API_URL;
const apiClient = new RewardApi(
  new Configuration({
    basePath: API_URL,
    accessToken: async () => {
      return await getAccessTokenRSC(logtoConfig, logtoConfig.resources![0]);
    },
  })
);

export async function getRewards(data: RewardControllerAllRequest) {
  try {
    const response = await apiClient.rewardControllerAll(data, {
      cache: "force-cache",
      next: { tags: [getRewards.name] },
    });


    return [null, response] as const;
  } catch (e) {
    console.error(e);
    return [new Error("Falha ao buscar premios"), null] as const;
  }
}

export async function getRewardById(storeId: string, rewardId: string) {
  return null;
}

export async function redeemReward(data: RewardControllerRedeemRequest) {
  try {
    const response = await apiClient.rewardControllerRedeem(data);
    return [null, response] as const;
  } catch (e) {
    console.error(e);
    return [new Error("Falha ao criar prêmio"), null] as const;
  }
}

export async function createReward(data: RewardControllerCreateRequest) {
  try {
    const response = await apiClient.rewardControllerCreate(data);
    return [null, response] as const;
  } catch (e) {
    console.error(e);
    return [new Error("Falha ao criar prêmio"), null] as const;
  }
}
