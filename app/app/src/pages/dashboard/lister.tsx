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
import { Contract as ContractType } from "@/lib/data";

import { ContractTable } from "../bid/all";
import { ContractContext } from "@/context/contract-context";
import Link from "next/link";
import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
import { Tabs, Card } from 'antd';
import AllContracts from "@/components/AllContracts"
import PendingContracts from "@/components/PendingContracts";
import ListedContracts from "@/components/ListedContracts";
import CompletedContracts from "@/components/CompletedContracts";


interface ListerDashboardProps {}

const ListerDashboard: React.FC<ListerDashboardProps> = ({}) => {
  const {} = useContext(WalletContext)!;
  const { contracts, setContracts } = useContext(ContractContext)!;

  const [loading, setLoading] = useState(false);

  const getContracts = async () => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      setContracts(dummyContracts);
      setLoading(false);
    }, 1000);
    try {
      // TODO: Get from blockchain
      //const contracts: Contract[] = SAMPLE_CONTRACT;

      // setContract(contracts);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const dummyContracts: Contract[] = [
    {
      id: "1",
      name: "Smart City Street Lighting Project",
      amount: 250000,
      owner: "Infrastructure Development Co.",
      status: "Progress",
      startDate: new Date("2023-08-01"),
      endDate: new Date("2023-12-31"),
      description: "Contract description goes here...",
    },
    {
      id: "2",
      name: "Smart Transportation System Development",
      amount: 500000,
      owner: "Urban Mobility Solutions Ltd.",
      status: "Pending",
      startDate: new Date("2023-09-15"),
      endDate: new Date("2024-06-30"),
      description: "Contract description goes here...",
    },
  ];
  
  const renderTitle = (title: string) => (
    <span>
      {title}
      <a
        style={{ float: 'right' }}
        href="https://www.google.com/search?q=antd"
        target="_blank"
        rel="noopener noreferrer"
      >
        more
      </a>
    </span>
  );
  
  const renderItem = (title: string, count: number) => ({
    value: title,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {title}
        <span>
          <UserOutlined /> {count}
        </span>
      </div>
    ),
  });
  
  const options = [
    {
      label: renderTitle('Libraries'),
      options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
    },
    {
      label: renderTitle('Solutions'),
      options: [renderItem('AntDesign UI FAQ', 60100), renderItem('AntDesign FAQ', 30010)],
    },
    {
      label: renderTitle('Articles'),
      options: [renderItem('AntDesign design language', 100000)],
    },
  ];
  
  const App: React.FC = () => (
    <AutoComplete
      popupClassName="certain-category-search-dropdown"
      dropdownMatchSelectWidth={500}
      style={{ width: 250 }}
      options={options}
    >
    </AutoComplete>
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'progress':
        return 'blue';
      case 'pending':
        return 'orange';
      case 'completed':
        return 'green';
      default:
        return 'default';
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
      buttonLabel="List Contract"
    >
      <DashboardShell>
        <DashboardHeader
          heading="My Contracts"
          text="Create and manage your contracts."
        >
          <Link href="/contract/add">
            <Button variant="outline">
              <Icons.add className="mr-2 h-4 w-4" />
              List Contract
            </Button>
          </Link>
        </DashboardHeader>
        <Input.Search size="large" placeholder="Search Contracts" />
        
        <Tabs defaultActiveKey="all">
  <Tabs.TabPane tab="All" key="all">
    <AllContracts contracts={contracts} getStatusColor={getStatusColor} />
  </Tabs.TabPane>
  <Tabs.TabPane tab="Listed" key="listed">
    <ListedContracts contracts={contracts} />
  </Tabs.TabPane>
  <Tabs.TabPane tab="Pending" key="pending">
    <PendingContracts contracts={contracts} />
  </Tabs.TabPane>
  <Tabs.TabPane tab="Completed" key="completed">
    <CompletedContracts contracts={contracts} />
  </Tabs.TabPane>
  </Tabs>


        <ContractTable contracts={contracts} />
      </DashboardShell>
    </DashboardLayout>
  );
};

export default ListerDashboard;
