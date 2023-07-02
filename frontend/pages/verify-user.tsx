import "regenerator-runtime/runtime";
import React, { useContext } from "react";

import MainLayout from "@/components/layouts/main-layout";
import { WalletContext } from "@/context/wallet-context";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { UserForm } from "@/components/forms/user-form";

interface VerifyUserProps {}

const VerifyUser: React.FC<VerifyUserProps> = ({}) => {
  const { isSignedIn } = useContext(WalletContext)!;

  if (!isSignedIn) {
    return <h1>Please SignIn to Continue</h1>;
  }

  

  return (
    <MainLayout>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <Card className="max-w-md mx-auto">
          <CardHeader />
          <CardContent>
            <UserForm className="max-w-sm" />
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  );
};

export default VerifyUser;
