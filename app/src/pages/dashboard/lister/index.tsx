import "regenerator-runtime/runtime"
import React, { useContext, useEffect, useState } from "react"
import { WalletContext } from "@/context/wallet-context"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { DashboardShell } from "@/components/shell"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ContractTable } from "@/components/lister/ListerContractTable"
import { ContractContext } from "@/context/contract-context"
import Link from "next/link"
import Head from "next/head"
import { AxiosError } from "axios"
import { server, showAxiosError } from "@/lib/api-helper"
import { ENDPOINTS } from "@/lib/constants"
import { Contract as PrismaContract } from "prisma/prisma-client"

interface ListerDashboardProps {}

const ListerDashboard: React.FC<ListerDashboardProps> = ({}) => {
  const [contracts, setContracts] = useState<PrismaContract[]>([])
  const [loading, setLoading] = useState(false)
  
  async function getContracts() {
    if (loading) return

    setLoading(true)

    try {
      const res = await server.get(ENDPOINTS.lister.getContracts)

      const data = res.data.data as {
        contracts: PrismaContract[]
      }
      setContracts(data.contracts)
    } catch (e: any) {
      const error = e as AxiosError

      showAxiosError({
        error,
        generic: "Failed to get contracts",
        additionalText: "Please try again later",
      })
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {

    getContracts()

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                Create Contract
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
