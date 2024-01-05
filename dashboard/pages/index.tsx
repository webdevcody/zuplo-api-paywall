import FullScreenLoading from "@/components/full-screen-loading";
import { SignInPage } from "@/components/sign-in-page";
import { StripePricingTable } from "@/components/stripe-pricing-table";
import { useUser } from "@/lib/hooks/use-is-subscribed";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

export default function IndexPage() {
  const { isLoading, isSubscribed, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isSubscribed) {
      router.push("/dashboard");
      return;
    }

    return () => {};
  }, [router, isSubscribed]);

  if (isLoading || isSubscribed) {
    return <FullScreenLoading />;
  }

  return (
    <>
      <Script src="https://js.stripe.com/v3/pricing-table.js" />

      {isAuthenticated ? <StripePricingTable /> : <SignInPage />}
    </>
  );
}
