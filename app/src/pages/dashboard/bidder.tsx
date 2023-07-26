import "regenerator-runtime/runtime";
import React, { useContext, useEffect, useState } from "react";

import { WalletContext } from "@/context/wallet-context";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { SAMPLE_CONTRACT } from "@/lib/data";
import { ContractTable } from "../bid/all";
import { ContractContext } from "@/context/contract-context";
import Link from "next/link";

interface BidderDashboardProps {}

const BidderDashboard: React.FC<BidderDashboardProps> = ({}) => {
  const {} = useContext(WalletContext)!;

  const [loading, setLoading] = useState(false);
  // const [contracts, setContracts] = useState<Contract[]>([]);
  const { contracts, setContracts } = useContext(ContractContext)!;

  const getContracts = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // TODO: Get from blockchain
      const contracts: Contract[] = SAMPLE_CONTRACT;

      setContracts(contracts);
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
      type="bidder"
      loading={loading}
      heading="My Bids"
      text="View and Manage Bids"
      buttonLabel="Available Contract"
    >
      <DashboardShell>
        <DashboardHeader heading="My Bids" text="View and manage your bids.">
          <Link href="/bid/all">
            <Button variant="outline">
              <Icons.add className="mr-2 h-4 w-4" />
              Available Bids
            </Button>
          </Link>
        </DashboardHeader>

        <ContractTable contracts={contracts} />
      </DashboardShell>
    </DashboardLayout>
  );
};

export default BidderDashboard;
