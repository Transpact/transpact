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
import { formatDate } from "@/lib/utils";

interface ContractDetailsPageProps {}

const ContractDetailsPage: React.FC<ContractDetailsPageProps> = ({}) => {
  const {} = useContext(WalletContext)!;
  const { id: contractId } = useParams();

  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<Contract | null | undefined>(
    undefined
  );

  const getContracts = async () => {
    console.log(contractId);

    if (loading || !contractId) return;

    setLoading(true);

    try {
      // TODO: Get from blockchain
      const contract: Contract = SAMPLE_CONTRACT[0];

      console.log(contract);

      setContract(contract);
    } catch (e) {
      setContract(null);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContracts();
  }, [contractId]);

  if (contract === null) {
    return <p>Loading</p>;
  }

  return (
    <DashboardLayout
      type="none"
      loading={loading || contract === undefined}
      heading="Contract Info"
      text="View and bid for contract"
      buttonLabel=""
    >
      <DashboardShell>
        <DashboardHeader heading={contract?.name ?? ""} text={""} />

        <p>
          <span className="font-bold">START: </span>{" "}
          {formatDate(contract?.startDate ?? new Date())}
        </p>

        <p>
          <span className="font-bold">DEADLINE: </span>{" "}
          {formatDate(contract?.endDate ?? new Date())}
        </p>

        <p>
          <span className="font-bold">QUATATION: </span> ${contract?.amount}
        </p>

        <p className="mt-6">{contract?.description}</p>
      </DashboardShell>
    </DashboardLayout>
  );
};

export default ContractDetailsPage;
