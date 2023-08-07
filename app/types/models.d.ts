type Contract = {
  id: string;
  name: string;
  owner: string;
  amount: number;
  status: "progress" | "complete"
  description: string;
  startDate: Date;
  endDate: Date;
  files: string[];
}