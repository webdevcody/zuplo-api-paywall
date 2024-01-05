import { SignInButton } from "./sign-in-button";
import Link from "next/link";

export const SignInPage = () => {
  return (
    <div className="flex flex-col">
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Money API: Where APIs meet 💸
          </h1>
          <h2 className="text-gray-700 max-w-[700px] text-lg  sm:text-xl">
            Money API is an Open Source example of how to create a monetizable
            API using <Link className="text-blue-500" href="https://vercel.com">Vercel</Link>,{" "}
            <Link className="text-blue-500" href="https://stripe.com">Stripe</Link> and{" "}
            <Link className="text-blue-500" href="https://zuplo.com">Zuplo</Link>.
            <br />
            <br />
            You can create a new API or bring any of your existing APIs and
            start monetizing them in minutes.
          </h2>
        </div>
      </section>
      <div className="flex w-full items-center justify-center">
        <SignInButton />
      </div>
    </div>
  );
};
