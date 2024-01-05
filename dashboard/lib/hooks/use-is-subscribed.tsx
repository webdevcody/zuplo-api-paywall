import { getSubscription, getUsage } from "../get-subscription";
import { getRequiredEnvVar } from "../utils";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

type UserUsage = {
  total_usage: number;
};
export const useUser = () => {
  const {
    isLoading: isAuth0Loading,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);

  useEffect(() => {
    if (isAuth0Loading) {
      return;
    }

    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const audience = getRequiredEnvVar("NEXT_PUBLIC_AUTH0_AUDIENCE");
    const getToken = async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience,
        },
      });

      const subscription = await getSubscription({
        accessToken: token,
      });

      if (subscription.error) {
        // TODO: better handling
        setIsLoading(false);
        throw new Error("Could not get subscription");
      }

      const usage = await getUsage({
        accessToken: token,
      });

      if (usage.error) {
        // TODO: better handling
        setIsLoading(false);
        throw new Error(usage.error);
      }

      setAccessToken(token);
      setIsSubscribed(true);
      setIsLoading(false);
      setSubscription(subscription);
      setUsage(usage);
    };

    getToken();
  }, [getAccessTokenSilently, isAuthenticated, isAuth0Loading]);

  return {
    auth0AccessToken: accessToken,
    isAuthenticated,
    isLoading,
    isSubscribed,
    subscription,
    usage,
  };
};
