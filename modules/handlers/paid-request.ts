import {
  ZuploRequest,
  ZuploContext,
  MemoryZoneReadThroughCache,
} from "@zuplo/runtime";
import { getActiveStripeSubscription } from "../services/stripe";
import { ErrorResponse, JsonResponse } from "../types";

import { processSuccessfulRequest } from "../utils/request-processor";

type MeteredRequestDetails = {
  stringUsageSubscriptionItemId: string;
};

export default async function handleRequest(
  request: ZuploRequest,
  context: ZuploContext
): Promise<JsonResponse | ZuploRequest> {
  const stripeCustomerId = request?.user?.data?.stripeCustomerId;

  if (!stripeCustomerId) {
    return new ErrorResponse("Your are not an existing customer", 401);
  }

  // Get subscription details from the cache first,
  // if not found, get it from Stripe and cache it
  const cache = new MemoryZoneReadThroughCache<MeteredRequestDetails>(
    "metered-requests-details",
    context
  );

  const cachedSubscritionDetails = await cache.get(stripeCustomerId);

  if (cachedSubscritionDetails) {
    processSuccessfulRequest({
      subscriptionId: cachedSubscritionDetails.stringUsageSubscriptionItemId,
      context,
    });

    return request;
  }

  // fetch subscription details and add to cache so next
  // time we don't have to make a request to Stripe
  const subscriptionDetails = await processCustomerDetails(
    stripeCustomerId,
    context
  );

  if (subscriptionDetails instanceof ErrorResponse) {
    return subscriptionDetails;
  }

  // void is used to ignore the promise so we don't block
  // the request execution, making it faster
  void cache.put(stripeCustomerId, subscriptionDetails, 60);

  processSuccessfulRequest({
    subscriptionId: subscriptionDetails.stringUsageSubscriptionItemId,
    context,
  });

  return request;
}

// checks if customer has a valid stripe subscriptions
// and creates a Consumer in the Zuplo Key Bucket in case it doesn't exist
const processCustomerDetails = async (
  stripeCustomerId: string,
  context: ZuploContext
): Promise<MeteredRequestDetails | ErrorResponse> => {
  try {
    const subscription = await getActiveStripeSubscription({
      stripeCustomerId,
      logger: context.log,
    });

    if (subscription instanceof ErrorResponse) {
      return subscription;
    }

    if (subscription.plan.usage_type !== "metered") {
      return new ErrorResponse("You don't have a valid subscription", 401);
    }

    return {
      stringUsageSubscriptionItemId: subscription.items.data[0].id,
    };
  } catch (err) {
    context.log.error(err);
    return new ErrorResponse("An error happened", 500);
  }
};
