import React from "react";
import { Contract } from "@/lib/data";
import { Card, Tag } from "antd";

interface CompletedContractsProps {
  contracts: Contract[];
}

const CompletedContracts: React.FC<CompletedContractsProps> = ({ contracts }) => {
  return (
    <div>
      {contracts.map((contract) => (
        <Card key={contract.id}>
          <h3>{contract.name}</h3>
          <p>{contract.description}</p>
          <p>Start Date: {contract.startDate.toLocaleDateString()}</p>
          <p>End Date: {contract.endDate.toLocaleDateString()}</p>
          <p>Amount: ${contract.amount.toFixed(2)}</p>
          <Tag color="green">Completed</Tag>
        </Card>
      ))}
    </div>
  );
};

export default CompletedContracts;
