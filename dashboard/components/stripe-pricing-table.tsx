import Link from "next/link";

export const StripePricingTable = () => {
  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Subscribe to your API here.
          </h1>
          <p className="text-muted-foreground max-w-[700px] text-lg  sm:text-xl">
            Zuplo generates a{" "}
            <Link
              className="text-blue-500"
              href="https://zuplo.com/docs/articles/developer-portal"
            >
              Developer Portal
            </Link>{" "}
            where your customers can explore your API's documentation and create
            API Keys using Zuplo's{" "}
            <Link
              className="text-blue-500"
              href="https://zuplo.com/docs/articles/api-key-management"
            >
              API Key Management
            </Link>
            .
          </p>
          <p className="text-muted-foreground max-w-[700px] text-lg  sm:text-xl">
            On checkout an account will be created for your customers on your
            API's own Developer Portal.
          </p>
          <p className="text-muted-foreground max-w-[700px] text-lg  sm:text-xl">
            You can use{" "}
            <Link
              className="text-blue-500"
              target="_blank"
              href="https://stripe.com/docs/testing#cards"
            >
              fake credit card numbers
            </Link>{" "}
            to test the Stripe integration and use a ToDo API deployed with
            Zuplo.
          </p>
        </div>
      </section>
      <div
        dangerouslySetInnerHTML={{
          __html: `
          <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
          <stripe-pricing-table pricing-table-id="prctbl_1NG34MB1fwUIXnUbQDYUwfiW"
          publishable-key="pk_test_51NG2yoB1fwUIXnUbe2HFOrRqdBOn5nrutcQovulTdjhzALqHS3ArVcFdO9zmyYfLwCDxkqgCdhZdehGaJxV2TvR300vp7lMlOQ">
          </stripe-pricing-table>
            `,
        }}
      />
    </>
  );
};
