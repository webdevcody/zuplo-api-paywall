import {
  environment,
  ZuploRequest,
  MemoryZoneReadThroughCache,
  ZuploContext,
} from "@zuplo/runtime";
import { ErrorResponse } from "../types";

interface UserInfo {
  sub: string;
  email: string;
}
export async function getUserInfo(
  request: ZuploRequest,
  context: ZuploContext
): Promise<UserInfo | ErrorResponse> {
  // IDPs rate limit their user-info endpoints, so we cache the result based on the user sub
  const cache = new MemoryZoneReadThroughCache<UserInfo>("user-info", context);
  const userSub = request?.user?.sub;

  if (!userSub) {
    return new ErrorResponse("User not found");
  }
  const cachedData = await cache.get(userSub);

  if (cachedData) {
    return cachedData;
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return new ErrorResponse("Authorization header not found");
  }

  // User Info: https://auth0.com/docs/api/authentication#get-user-info
  const response = await fetch(`https://${environment.AUTH0_DOMAIN}/userinfo`, {
    headers: {
      "content-type": "application/json",
      authorization: authHeader,
    },
  });

  if (response.status !== 200) {
    return new ErrorResponse(
      `Could not get user info from identity provider (status: ${response.status} - ${response.statusText})`
    );
  }

  // store in cache for next time
  const data = await response.json();
  cache.put(userSub, data, 3600);

  return data;
}
