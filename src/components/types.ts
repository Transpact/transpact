export interface Contract {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date; 
  amount: number;
  status: "Listed" | "Pending" | "Completed";
}