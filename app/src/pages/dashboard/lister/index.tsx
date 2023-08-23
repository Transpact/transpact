import "regenerator-runtime/runtime"
import React, { useContext, useEffect, useState } from "react"
import { WalletContext } from "@/context/wallet-context"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { DashboardShell } from "@/components/shell"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ContractTable } from "../../bid/all"
import { ContractContext } from "@/context/contract-context"
import Link from "next/link"
import Head from "next/head"

interface ListerDashboardProps {}

const ListerDashboard: React.FC<ListerDashboardProps> = ({}) => {
  const {} = useContext(WalletContext)!
  const { contracts, setContracts } = useContext(ContractContext)!

  const [loading, setLoading] = useState(false)

  const getContracts = async () => {
    if (loading) return

    setLoading(true)

    try {
      // TODO: Get contracts from the blockchain or API
      const fetchedContracts: Contract[] = [
        // Add your fetched contracts here
      ]

      setContracts(fetchedContracts)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getContracts()
  }, [])

  return (
    <>
      <Head>
        <title>Lister Dashboard</title>
      </Head>
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
            text="Create and manage your contracts."
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
    </>
  )
}

export default ListerDashboard
