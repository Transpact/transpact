import "regenerator-runtime/runtime";
import React, { useContext, useEffect, useState } from "react";

import { WalletContext } from "@/context/wallet-context";
import DashboardLayout from "@/components/layouts/dashboard-layout";

import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";
import { SAMPLE_CONTRACT } from "@/lib/data";

interface ContractDetailsPageProps {}

const ContractDetailsPage: React.FC<ContractDetailsPageProps> = ({}) => {
  const {} = useContext(WalletContext)!;
  const { id: contractId } = useParams();

  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<Contract | null>(null);

  const getContracts = async () => {
    if (loading || !contractId) return;

    setLoading(true);

    try {
      // TODO: Get from blockchain
      const contract: Contract = SAMPLE_CONTRACT[0];

      setContract(contract);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContracts();
  }, []);

  return (
    <DashboardLayout
      type="none"
      loading={loading}
      heading="Contract Info"
      text="View and bid for contract"
      buttonLabel=""
    >
      <DashboardShell>
        <DashboardHeader
          heading={contract?.name ?? ""}
          text={contract?.description ?? ""}
        ></DashboardHeader>
      </DashboardShell>
    </DashboardLayout>
  );
};

export default ContractDetailsPage;
