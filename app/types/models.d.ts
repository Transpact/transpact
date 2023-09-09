import { number } from "zod";

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

  id: string
  email: string
  wallet_address: string
  industry_type: string
  user_type: string

  // Company Location Info
  country:string
  region:string
  postal_code:string
  address:string

  // company info

  company_name:string
  company_logo:string
  tax_identification_number:string
  registration_document_type:string
  buisness_registration_documentstring
  user_completed:boolean
  website:string
  experience: number
}

