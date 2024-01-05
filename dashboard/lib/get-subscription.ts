import { getRequiredEnvVar } from "./utils";

export const getSubscription = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  const subscriptionRequest = await fetch(
    `${getRequiredEnvVar("NEXT_PUBLIC_API_URL")}/v1/subscription`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const subscriptionJson = await subscriptionRequest.json();

  return subscriptionJson;
};

export const getUsage = async ({ accessToken }: { accessToken: string }) => {
  const usageRequest = await fetch(
    `${getRequiredEnvVar("NEXT_PUBLIC_API_URL")}/v1/subscription/usage`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const usageJson = await usageRequest.json();

  return usageJson;
};
