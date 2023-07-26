import "regenerator-runtime/runtime";
import React, { useContext, useEffect, useState } from "react";

import { WalletContext } from "@/context/wallet-context";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { SAMPLE_CONTRACT } from "@/lib/data";
import { ContractTable } from "../bid/all";
import { ContractContext } from "@/context/contract-context";
import Link from "next/link";

interface ListerDashboardProps {}

const ListerDashboard: React.FC<ListerDashboardProps> = ({}) => {
  const {} = useContext(WalletContext)!;
  const { contracts, setContracts } = useContext(ContractContext)!;

  const [loading, setLoading] = useState(false);

  const getContracts = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // TODO: Get from blockchain
      const contracts: Contract[] = SAMPLE_CONTRACT;

      // setContract(contracts);
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
      type="lister"
      loading={loading}
      heading="Manage Contracts"
      text="Add and Manage Contracts"
      buttonLabel="Add Contract"
    >
      <DashboardShell>
        <DashboardHeader
          heading="My Contracts"
          text="Create and manage your contracts."
        >
          <Link href="/contract/add">
            <Button variant="outline">
              <Icons.add className="mr-2 h-4 w-4" />
              Add Contract
            </Button>
          </Link>
        </DashboardHeader>

        <ContractTable contracts={contracts} />
      </DashboardShell>
    </DashboardLayout>
  );
};

export default ListerDashboard;
