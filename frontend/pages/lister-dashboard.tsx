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

interface ListerDashboardProps {}

const ListerDashboard: React.FC<ListerDashboardProps> = ({}) => {
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
      loading={loading}
      heading="Manage Contracts"
      text="Add and Manage Contracts"
      buttonLabel="Add Contract"
    >
      <DashboardShell>
        <DashboardHeader
          heading="Employees"
          text="Create and manage employees."
        >
          <a href="/employees/add">
            <Button variant="outline">
              <Icons.add className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </a>
        </DashboardHeader>

        <Table>
          <TableCaption>A list of all employees.</TableCaption>
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
                  <a href={`/`} className="mr-2">
                    <Button className="rounded-full">
                      <Icons.edit className="h-4 w-4" />
                    </Button>
                  </a>

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

export default ListerDashboard;
