import "regenerator-runtime/runtime";
import React, { useContext, useState } from "react";

import { WalletContext } from "@/context/wallet-context";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { NewContractForm } from "@/components/forms/new-contract-form";
import { ContractContext } from "@/context/contract-context";
import Link from "next/link";

interface NewContractProps {}

const NewContract: React.FC<NewContractProps> = ({}) => {
  const {} = useContext(WalletContext)!;
  const { contracts, setContracts } = useContext(ContractContext)!;

  const [loading, setLoading] = useState(false);

  const submitForm = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // TODO: Form submit here
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      type="lister"
      loading={false}
      heading=""
      text=""
      buttonLabel=""
    >
      <DashboardShell>
        <DashboardHeader
          heading="Add Contract"
          text="Create and manage your contracts."
        >
          <Link href="/dashboard/lister">
            <Button variant="outline">
              <Icons.users className="mr-2 h-4 w-4" />
              View My Contracts
            </Button>
          </Link>
        </DashboardHeader>

        <NewContractForm />
      </DashboardShell>
    </DashboardLayout>
  );
};

export default NewContract;
