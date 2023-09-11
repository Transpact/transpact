import { number } from "zod";

type Contract = {
  id: string
  contract_type: string      
  status: string            
  title: string
  skills_required: string[]
  legal_requirements: string
  payment_method: string
  total_amount: number
  renewal: boolean
  description: string
  contract_visibility: string
  contract_duration: string
  budget_range: string
  acceptedBidder: any
  files: string[]
  contract_creator: any
  bidders: any
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

