import React from "react";
import { Contract } from "@/lib/data";
import { Card, Tag } from "antd";

interface AllContractsProps {
  contracts: Contract[];
  getStatusColor: (status: string) => string;
}

const AllContracts: React.FC<AllContractsProps> = ({ contracts, getStatusColor }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {contracts?.length === 0 ? (
        <Card className="bg-gray-100 p-4">
          <p>No contracts found.</p>
        </Card>
      ) : (
        contracts?.map((contract) => (
          <Card key={contract.id}>
            <h3 className="text-lg font-semibold mb-2">{contract.name}</h3>
            <p>{contract.description}</p>
            {contract.startDate instanceof Date && contract.endDate instanceof Date ? (
              <>
                <p>Start Date: {contract.startDate.toLocaleDateString()}</p>
                <p>End Date: {contract.endDate.toLocaleDateString()}</p>
              </>
            ) : (
              <>
                <p>Start Date: Not available</p>
                <p>End Date: Not available</p>
              </>
            )}
            <p>Amount: ${contract.amount.toFixed(2)}</p>
            <Tag color={getStatusColor(contract.status)}>{contract.status}</Tag>
          </Card>
        ))
      )}
    </div>
  );
};

export default AllContracts;
