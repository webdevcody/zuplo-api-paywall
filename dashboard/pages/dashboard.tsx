import { CurrentSubscriptionUsage } from "@/components/current-subscription";
import FullScreenLoading from "@/components/full-screen-loading";
import { KeyManager } from "@/components/key-manager/key-manager";
import { useUser } from "@/lib/hooks/use-is-subscribed";
import { getRequiredEnvVar } from "@/lib/utils";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const { isLoading, isSubscribed, subscription, usage, auth0AccessToken } =
    useUser();
  const router = useRouter();
  const zuploUrl = getRequiredEnvVar("NEXT_PUBLIC_API_URL") + "/v1";

  if (isLoading) {
    return <FullScreenLoading />;
  }

  if (!isSubscribed) {
    router.push("/");
    return <FullScreenLoading />;
  }

  if (!subscription || !usage || !auth0AccessToken) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="items-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl pb-8">
            To use the API, use the API Key manager below:
          </h1>
          <div className="my-10">
            <KeyManager apiUrl={zuploUrl} accessToken={auth0AccessToken} />
          </div>
          <p className="pt-10 max-w-[700px] text-lg  sm:text-xl">
            Make an authenticated API request:
          </p>
          <code>
            curl &apos;{zuploUrl}/todos&apos; \ <br />
            --header &apos;Authorization: Bearer YOUR_KEY_HERE&apos;
          </code>
        </div>
      </section>
      <CurrentSubscriptionUsage usage={usage} />
    </div>
  );
}
