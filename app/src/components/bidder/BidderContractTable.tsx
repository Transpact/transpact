import "regenerator-runtime/runtime"
import React, { useContext, useEffect, useState } from "react"

import { WalletContext } from "@/context/wallet-context"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardShell } from "@/components/shell"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { SAMPLE_CONTRACT } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { ContractContext } from "@/context/contract-context"
import Link from "next/link"
import { Contract as PrismaContract } from "@prisma/client"

export const BidderContractTable: React.FC<{
    contracts: PrismaContract[],
    tableTitle: String
  }> = ({ contracts,tableTitle }) => {
    return (
      <Table>
        <TableCaption>{tableTitle}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Budget Range</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Bids</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
  
        <TableBody>
          {contracts.map(
            ({
              title,
              budget_range,
              id,
              contract_duration,
              contract_type
            }) => (
              <TableRow key={id}>
                <TableCell className="font-medium">{title}</TableCell>
                <TableCell>{budget_range}</TableCell>
                <TableCell>{contract_duration}</TableCell>
                <TableCell>{contract_type}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/contract/${id}`} className="mr-2">
                    <Button className="rounded-full">
                      <Icons.info className="h-4 w-4" />
                    </Button>
                  </Link>
  
                  {/* <Button className="rounded-full" onClick={() => {}}>
                  <Icons.trash className="h-4 w-4" />
                </Button> */}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    )
  }
  