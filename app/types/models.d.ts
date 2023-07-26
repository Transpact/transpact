type Contract = {
  id: string;
  name: string;
  owner: string;
  amount: string;
  status: "progress" | "complete";
  description: string;
  startDate: Date;
  endDate: Date;
  files: string[];
};
