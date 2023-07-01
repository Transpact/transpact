import "regenerator-runtime/runtime";
import React from "react";

import { Wallet } from "@/near-wallet";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import MainLayout from "@/components/layouts/main-layout";

interface StartPageProps {
  isSignedIn: boolean;
  contractId?: string;
  wallet: Wallet;
}

const StartPage: React.FC<StartPageProps> = ({
  isSignedIn,
  contractId,
  wallet,
}) => {
  const stars = 0;

  return (
    <MainLayout isSignedIn={isSignedIn} contractId={contractId} wallet={wallet}>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Get Started
          </h1>

          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Choose one of two options
          </p>

          <div className="space-x-4">
            <a
              href="/start/lister"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Lister
            </a>

            <a
              href="/start/bidder"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Bidder
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default StartPage;
