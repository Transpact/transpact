type Contract = {
  id: string;
  name: string;
  owner: string;
  amount: number;
  status: "Progress" | "Listed" | "Pending" | "Completed";
  description: string;
  startDate: Date;
  endDate: Date;
  files?: string[];
};
