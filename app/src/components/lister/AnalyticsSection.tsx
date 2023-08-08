import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AnalyticsSection: React.FC = () => {
  // Dummy data
  const totalContractLister = 256;
  const totalPendingContracts = 78;
  const totalCompletedContracts = 124;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent>
          <div className="text-2xl font-bold">{totalContractLister}</div>
          <p className="text-xs text-muted-foreground">
            Total Contract Lister
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="text-2xl font-bold">{totalPendingContracts}</div>
          <p className="text-xs text-muted-foreground">
            Total Pending Contracts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="text-2xl font-bold">{totalCompletedContracts}</div>
          <p className="text-xs text-muted-foreground">
            Total Completed Contracts
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSection;
