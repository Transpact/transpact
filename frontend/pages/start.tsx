import "regenerator-runtime/runtime";
import React, { useContext } from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import MainLayout from "@/components/layouts/main-layout";
import { WalletContext } from "@/context/wallet-context";
import { Link } from "react-router-dom";

interface StartPageProps {}

const StartPage: React.FC<StartPageProps> = ({}) => {
  const {} = useContext(WalletContext)!;

  return (
    <MainLayout>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Get Started
          </h1>

          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Choose one of two options
          </p>

          <div className="space-x-4">
            <Link
              to="/verify-user?redirect=/dashboard/lister"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Lister
            </Link>

            <Link
              to="/verify-user?redirect=/dashboard/bidder"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Bidder
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default StartPage;
