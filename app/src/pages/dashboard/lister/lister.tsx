import React, { useContext, useEffect, useState } from "react"
import { WalletContext } from "@/context/wallet-context"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { DashboardShell } from "@/components/shell"
import { DashboardHeader } from "@/components/header"
import { SAMPLE_CONTRACT } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ContractTable } from "@/pages/bid/all"
import Link from "next/link"
import { server } from "@/lib/api-helper"
import { endpoints } from "@/lib/utils"

interface ListerDashboardProps {}

interface LocalContract {
  id: string
  name: string
  amount: number
  owner: string
  status: string
  startDate: Date
  endDate: Date
  description: string
  files?: string[]
}
const ListerDashboard: React.FC<ListerDashboardProps> = ({}) => {
  const {} = useContext(WalletContext)!
  const [loading, setLoading] = useState(false)

  const contracts: Contract[] = SAMPLE_CONTRACT;

  async function getContracts(){

    try{

      let res = await server.get(endpoints.contract)
      let data = res.data.data as {
        contracts: Contract[]
      }

    } catch( e:any ){

    } finally {

    }

  }

  useEffect(() => {
    // No need for any data fetching since you're using dummyContracts
  }, [])

  return (
    <DashboardLayout
      type="lister"
      loading={loading}
      heading="Manage Contracts"
      text="Add and Manage Contracts"
      buttonLabel="List Contract"
    >
      <DashboardShell>
        <DashboardHeader
          heading="My Contracts"
          text="List and manage your contracts."
        >
          <Link href="/dashboard/lister/contract/add">
            <Button variant="outline">
              <Icons.add className="mr-2 h-4 w-4" />
              List Contract
            </Button>
          </Link>
        </DashboardHeader>
        
        <ContractTable contracts={contracts} />
      </DashboardShell>
    </DashboardLayout>
  )
}

export default ListerDashboard
