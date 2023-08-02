import React from "react";
import { Contract } from "@/lib/data";
import { Card, Tag } from "antd";

interface PendingContractsProps {
  contracts: Contract[];
}

const PendingContracts: React.FC<PendingContractsProps> = ({ contracts }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {contracts?.length === 0 ? (
        <Card className="bg-gray-100 p-4">
          <p>No pending contracts found.</p>
        </Card>
      ) : (
        contracts?.map((contract) => (
          <Card key={contract.id}>
            <h3 className="text-lg font-semibold mb-2">{contract.name}</h3>
            <p>{contract.description}</p>
            <p>Start Date: {contract.startDate.toLocaleDateString()}</p>
            <p>End Date: {contract.endDate.toLocaleDateString()}</p>
            <p>Amount: ${contract.amount.toFixed(2)}</p>
            <Tag color="orange">Pending</Tag>
          </Card>
        ))
      )}
    </div>
  );
};

export default PendingContracts;
