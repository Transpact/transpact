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
import { Link } from "react-router-dom";

interface BidderDashboardProps {}

const BidderDashboard: React.FC<BidderDashboardProps> = ({}) => {
  const {} = useContext(WalletContext)!;

  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);

  const getContracts = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // TODO: Get from blockchain
      const contracts: Contract[] = [
        {
          name: "Test",
          owner: "prathamesh_m.testnet",
          amount: "1000",
          status: "progress",
        },
        {
          name: "Test",
          owner: "prathamesh_m.testnet",
          amount: "1000",
          status: "progress",
        },
        {
          name: "Test",
          owner: "prathamesh_m.testnet",
          amount: "1000",
          status: "progress",
        },
      ];

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
          <Link to="/bid/all">
            <Button variant="outline">
              <Icons.add className="mr-2 h-4 w-4" />
              Available Bids
            </Button>
          </Link>
        </DashboardHeader>

        <Table>
          <TableCaption>A list of all bids awarded to you.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>X</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {contracts.map(({ name, amount, owner, status }, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell>{`${owner}`}</TableCell>
                <TableCell>{amount}</TableCell>
                <TableCell>{status}</TableCell>
                <TableCell>{"X"}</TableCell>
                <TableCell className="text-right">
                  <Link to="/" className="mr-2">
                    <Button className="rounded-full">
                      <Icons.edit className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Button className="rounded-full" onClick={() => {}}>
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardShell>
    </DashboardLayout>
  );
};

export default BidderDashboard;
