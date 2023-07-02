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
import { SAMPLE_CONTRACT } from "@/lib/data";

export const ContractTable: React.FC<{
  contracts: Contract[];
}> = ({ contracts }) => {
  return (
    <Table>
      <TableCaption>A list of all available bids.</TableCaption>
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
        {contracts.map(({ name, amount, owner, status, id }, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{name}</TableCell>
            <TableCell>{`${owner}`}</TableCell>
            <TableCell>{amount}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>{"X"}</TableCell>
            <TableCell className="text-right">
              <Link to={`/contract/${id}`} className="mr-2">
                <Button className="rounded-full">
                  <Icons.info className="h-4 w-4" />
                </Button>
              </Link>

              {/* <Button className="rounded-full" onClick={() => {}}>
                <Icons.trash className="h-4 w-4" />
              </Button> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface AllBidsPageProps {}

const AllBidsPage: React.FC<AllBidsPageProps> = ({}) => {
  const {} = useContext(WalletContext)!;

  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);

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
      heading="Available Bids"
      text="View and Make Bids"
      buttonLabel="Available Bids"
    >
      <DashboardShell>
        <DashboardHeader heading="Available Bids" text="View and make bids.">
          <Link to="/dashboard/bidder">
            <Button variant="outline">
              <Icons.add className="mr-2 h-4 w-4" />
              My Bids
            </Button>
          </Link>
        </DashboardHeader>

        <ContractTable contracts={contracts} />
      </DashboardShell>
    </DashboardLayout>
  );
};

export default AllBidsPage;
