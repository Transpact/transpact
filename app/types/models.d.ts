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

type User = {
  id: string,
  email: string 
  wallet_address: String | undefined
  user_type: string
}