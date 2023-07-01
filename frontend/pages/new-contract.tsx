import "regenerator-runtime/runtime";
import React, { useContext, useState } from "react";

import { WalletContext } from "@/context/wallet-context";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { NewContractForm } from "@/components/forms/new-contract-form";
import { Link } from "react-router-dom";

interface NewContractProps {}

const NewContract: React.FC<NewContractProps> = ({}) => {
  const {} = useContext(WalletContext)!;

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
    <DashboardLayout loading={false} heading="" text="" buttonLabel="">
      <DashboardShell>
        <DashboardHeader
          heading="Add Contract"
          text="Create and manage your contracts."
        >
          <Link to="/dashboard/lister">
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
