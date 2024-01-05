import { Logger, ZuploContext } from "@zuplo/runtime";
import { triggerMeteredSubscriptionItemUsage } from "../services/stripe";
import { BatchDispatch } from "../utils/batch-dispatcher";

type StripeSubscriptionItemId = string;
type TotalRequests = number;
type CustomerUsageDetails = {
  subscriptionItemId: StripeSubscriptionItemId;
  totalRequests: TotalRequests;
};

const stripeUsageUpdateDispatcher = async (
  customerUsageDetails: CustomerUsageDetails[],
  _: Logger
) => {
  // when we get here, we know that we have a batch of
  // usage records for a single subscription item
  // so we can just sum up the total requests
  const totalRequests = customerUsageDetails.reduce(
    (acc, { totalRequests }) => acc + totalRequests,
    0
  );

  // sends the usage record to stripe
  await triggerMeteredSubscriptionItemUsage(
    customerUsageDetails[0].subscriptionItemId,
    totalRequests
  );
};

// we send request to Stripe in batches of 20 miliseconds
// which means we can send 50 requests per second
// (Stripe's rate limit is 100 requests per second)
const stripeDispatcher = new BatchDispatch<CustomerUsageDetails>(
  "stripe-usage-update-dispatcher",
  20,
  stripeUsageUpdateDispatcher
);

const apiKeyConsumerUsageBatchDispatcher = async (
  stripeCustomerIds: StripeSubscriptionItemId[],
  logger: Logger
) => {
  const customersTotalRequests = new Map<
    StripeSubscriptionItemId,
    TotalRequests
  >();

  stripeCustomerIds.map((stripeCustomerId) => {
    const currentTotal = customersTotalRequests.get(stripeCustomerId) ?? 0;
    customersTotalRequests.set(stripeCustomerId, currentTotal + 1);
  });

  const customerUsageDetails = Array.from(customersTotalRequests.entries()).map(
    ([subscriptionItemId, totalRequests]) => ({
      subscriptionItemId,
      totalRequests,
    })
  );

  for (const customerUsageDetail of customerUsageDetails) {
    stripeDispatcher.enqueue(customerUsageDetail, logger);
  }
  await stripeDispatcher.waitUntilFlushed();
};

const requestProcessorBatchDispatcher =
  new BatchDispatch<StripeSubscriptionItemId>(
    "api-key-consumer-usage-batch-dispatcher",
    100,
    apiKeyConsumerUsageBatchDispatcher
  );

export const processSuccessfulRequest = ({
  subscriptionId,
  context,
}: {
  subscriptionId: string;
  context: ZuploContext;
}) => {
  // Batch the usage record to be sent to Stripe
  // so we don't hit Stripe's API rate limit.
  // This is also done in a fire-and-forget fashion
  // to make the request faster.
  requestProcessorBatchDispatcher.enqueue(subscriptionId, context.log);

  // `waitUntil` ensures that the batch is flushed
  // before the instance that handles the request
  // is destroyed.
  context.waitUntil(requestProcessorBatchDispatcher.waitUntilFlushed());
};
