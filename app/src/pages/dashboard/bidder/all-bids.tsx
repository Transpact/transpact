import "regenerator-runtime/runtime"
import React, { useContext, useEffect, useState } from "react"

import { WalletContext } from "@/context/wallet-context"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { DashboardShell } from "@/components/shell"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { SAMPLE_CONTRACT } from "@/lib/data"
import { BidderContractTable } from "@/components/bidder/BidderContractTable"
import { ContractContext } from "@/context/contract-context"
import Link from "next/link"
import Head from "next/head"
import { server, showAxiosError } from "@/lib/api-helper"
import { ENDPOINTS } from "@/lib/constants"
import { Contract as PrismaContract } from "prisma/prisma-client"
import { AxiosError } from "axios"
import { ContractTable } from "@/components/lister/ListerContractTable"

interface BidderDashboardProps {}

const BidderDashboard: React.FC<BidderDashboardProps> = ({}) => {
  const {} = useContext(WalletContext)!

  const [loading, setLoading] = useState(false)
  const [contracts, setContracts] = useState<PrismaContract[]>([])

  async function getContracts() {
    if (loading) return

    setLoading(true)
    
    try {
      const res = await server.get(ENDPOINTS.bidder.contracts + "?filter=all")

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
  }, [])

  return (
    <>
      <Head>
        <title>Bidder Dashboard</title>
      </Head>
      <DashboardLayout
        type="bidder"
        loading={loading}
        heading="My Bids"
        text="View and Manage Bids"
        buttonLabel="Available Contract"
      >
        <DashboardShell>
          <DashboardHeader heading="My Bids" text="View and manage your bids.">
            <Link href="/bid/all">
              <Button variant="outline">
                <Icons.add className="mr-2 h-4 w-4" />
                Available Bids
              </Button>
            </Link>
          </DashboardHeader>
          <ContractTable contracts={contracts}/>
        </DashboardShell>
      </DashboardLayout>
    </>
  )
}

export default BidderDashboard
