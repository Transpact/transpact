"use client"

import React, { useContext, useEffect, useState } from "react"

import { WalletContext } from "@/context/wallet-context"
import DashboardLayout from "@/components/layouts/dashboard-layout"

import { DashboardShell } from "@/components/shell"
import { DashboardHeader } from "@/components/header"

import { useRouter } from "next/router"
import { server, showAxiosError } from "@/lib/api-helper"
import { ENDPOINTS } from "@/lib/constants"
import { FaFileContract } from "react-icons/fa"
import {
  AiOutlineUser,
  AiOutlineCheckCircle,
  AiOutlineArrowRight,
  AiOutlineUpload,
} from "react-icons/ai"
import { BsPencilSquare } from "react-icons/bs"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AxiosError } from "axios"
import { toast } from "@/components/ui/use-toast"
import ListBiddersTable, { Bidder } from "@/components/lister/ListBiddersTable"
import { BidderApplication, Contract } from "~/types/models"
import { DocumentViewer } from "@/components/generic/doc-viewer"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ContractDetailsPageProps {}

const ContractDetailsPage: React.FC<ContractDetailsPageProps> = ({}) => {
  const {} = useContext(WalletContext)!
  const router = useRouter()
  const contractId = router.query.id

  const [loading, setLoading] = useState<boolean>(false)
  const [quotationAmount, setQuotationAmount] = useState<number>(0)

  const [contract, setContract] = useState<Contract | null | undefined>(
    undefined
  )
  const [progressBar, setProgressBar] = useState<number>(1)
  const [bidderAccepted, setBidderAccepted] = useState<boolean>(false)

  const [bidderApplication, setBidderApplication] =
    React.useState<BidderApplication | null>(null)
  const [viewBidder, setViewBidder] = useState<string | null>(null)

  const [contractValidated, setContractValidated] = React.useState<number>(0)

  const getContract = async () => {
    setLoading(true)

    try {
      // TODO: Get from blockchain

      const res = await server.get(
        ENDPOINTS.lister.contract + `?id=${contractId}`
      )

      const data = res.data.data as {
        contracts: Contract
      }
      switch (data.contracts.payment_method) {
        case "BANK_TRANSFER":
          data.contracts.payment_method = "Bank Transfer"
          break

        case "TRANSPACT_FUND_WALLET":
          data.contracts.payment_method = "Transpact Fund Wallet"
          break

        case "BANK_TRANSFER":
          data.contracts.payment_method = "Cash"
          break
      }
      setQuotationAmount(data.contracts.total_amount)
      setContract(data.contracts)

      switch (data.contracts.status as String) {
        case "CREATED":
          setProgressBar(1)
          break

        case "BIDDER_FOUND":
          setProgressBar(2)
          break

        case "APPROVED":
          setProgressBar(3)
          break

        case "SIGNED":
          setProgressBar(4)
          break

        case "FINISHED":
          setProgressBar(5)
          break
      }
    } catch (e) {
      setContract(null)
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  async function acceptBidder(bidderApplicationId: string) {
    try {
      const resp = await server.post(
        ENDPOINTS.lister.contract +
          `?id=${contractId}&application=${bidderApplicationId}`
      )

      toast({
        title: "Bidder Accepted!",
        description: "Bidder has been accepted and notification has been sent.",
        variant: "default",
      })

      setBidderAccepted(true)
    } catch (e: any) {
      const error = e as AxiosError

      showAxiosError({
        error,
        generic: "Failed to accept bidder",
        additionalText: "Please try to login again",
      })
    }
  }

  async function approveContract() {
    try {
      setLoading(true)

      await server.put(
        ENDPOINTS.lister.contract + `?id=${contractId}`,
        {
          status: "APPROVED",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      toast({
        title: "Bidder Proposal Approved",
        description:
          "Bidder Proposal has been accepted and notification has been sent.",
        variant: "default",
      })

      setBidderAccepted(true)
    } catch (e: any) {
      const error = e as AxiosError

      showAxiosError({
        error,
        generic: "Failed to accept bidder",
        additionalText: "Please try to login again",
      })
    } finally {
      setLoading(false)
    }
  }

  async function uploadOnChain() {
    try {
      setLoading(true)

      await server.post(ENDPOINTS.onChain.uploadContact + `?id=${contractId}`)

      toast({
        title: "Upload Successfull",
        description: "Contract Uploaded On Blockchain.",
        variant: "default",
      })
    } catch (e: any) {
      const error = e as AxiosError

      showAxiosError({
        error,
        generic: "Failed to accept bidder",
        additionalText: "Please try to login again",
      })
    } finally {
      setLoading(false)
    }
  }

  async function validateContract() {
    try {
      const res = await server.get(
        ENDPOINTS.onChain.uploadContact + `?id=${contractId}`
      )
      let validation = res.data.data

      console.log("=======")
      // 1 -> VALIDATED
      // 2 -> INVALID
      // 3 -> Server / network error

      if (validation === "VALID") {
        setContractValidated(1)
      } else {
        setContractValidated(2)
      }
    } catch (e) {
      setContractValidated(3)
    }
  }

  async function getBidderApplication() {
    try {
      const res = await server.get(
        ENDPOINTS.bidder.application + `?bidder_application_id=${viewBidder}`
      )

      const data = res.data.data as BidderApplication
      setBidderApplication(data)
    } catch (e) {
      setBidderApplication(null)
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getContract()
  }, [bidderAccepted])

  useEffect(() => {
    getBidderApplication()
  }, [viewBidder])

  useEffect(() => {
    if (progressBar == 5) {
      validateContract()
    }
  }, [progressBar])

  if (contract === null || contract === undefined) {
    return <p>Loading</p>
  }

  return (
    <DashboardLayout
      type="empty"
      loading={loading || contract === undefined}
      heading="Contract Info"
      text="View and bid for contract"
      buttonLabel=""
    >
      <DashboardShell>
        <Card className="flex w-full flex-col items-center py-10">
          {/* contract progress bar */}
          <div className="w-full">
            <div className="mb-5 flex w-full items-center justify-end pr-10">
              {contractValidated === 0 && (
                <div
                  title="Validated"
                  className="h-3 w-3 animate-spin rounded-full bg-yellow-500 p-[1px]"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                </div>
              )}

              {contractValidated === 1 && (
                <div
                  title="Validated"
                  className="h-3 w-3 rounded-full bg-green-500 p-[1px]"
                ></div>
              )}
              {contractValidated === 2 && (
                <div
                  title="Invalid"
                  className="h-3 w-3 rounded-full bg-red-500 p-[1px]"
                ></div>
              )}
              {contractValidated === 3 && (
                <div
                  title="Network Error"
                  className="h-3 w-3 rounded-full bg-yellow-500 p-[1px]"
                ></div>
              )}
            </div>
            <div className="flex">
              <div className="w-1/4">
                <div className="relative mb-2">
                  <div className="mx-auto flex h-10 w-10 items-center rounded-full bg-green-500 text-lg text-white">
                    <span className="w-full text-center text-white">
                      <FaFileContract className="w-full fill-current" />
                    </span>
                  </div>
                </div>

                <div className="text-center text-xs md:text-base">
                  Initiated
                </div>
              </div>

              <div className="w-1/4">
                <div className="relative mb-2">
                  <div
                    className="align-center absolute flex content-center items-center align-middle"
                    style={{
                      width: "calc(100% - 2.5rem - 1rem)",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="align-center w-full flex-1 items-center rounded bg-gray-200 align-middle">
                      <div
                        className={`w-0 py-1 ${
                          progressBar >= 2 && "bg-green-300"
                        } rounded`}
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>

                  <div
                    className={`mx-auto h-10 w-10 ${
                      progressBar >= 2 && "bg-green-500"
                    } ${
                      progressBar < 2 && "border-2 border-gray-200"
                    } flex items-center rounded-full text-lg text-white`}
                  >
                    <span
                      className={`text-center ${
                        progressBar >= 2 ? "text-white" : "text-gray-600"
                      } w-full`}
                    >
                      <AiOutlineUser className="w-full fill-current" />
                    </span>
                  </div>
                </div>

                <div className="text-center text-xs md:text-base">
                  Bidder Found
                </div>
              </div>

              <div className="w-1/4">
                <div className="relative mb-2">
                  <div
                    className="align-center absolute flex content-center items-center align-middle"
                    style={{
                      width: "calc(100% - 2.5rem - 1rem)",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="align-center w-full flex-1 items-center rounded bg-gray-200 align-middle">
                      <div
                        className={`w-0 ${
                          progressBar >= 3 && "bg-green-300"
                        } rounded py-1`}
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>

                  <div
                    className={`mx-auto h-10 w-10 ${
                      progressBar >= 3 && "bg-green-500"
                    } ${
                      progressBar < 3 && "border-2 border-gray-200"
                    } flex items-center rounded-full text-lg text-white`}
                  >
                    <span
                      className={`text-center ${
                        progressBar >= 3 ? "text-white" : "text-gray-600"
                      } w-full`}
                    >
                      <AiOutlineArrowRight className="w-full fill-current" />
                    </span>
                  </div>
                </div>

                <div className="text-center text-xs md:text-base">
                  Proposal Approved
                </div>
              </div>

              <div className="w-1/4">
                <div className="relative mb-2">
                  <div
                    className="align-center absolute flex content-center items-center align-middle"
                    style={{
                      width: "calc(100% - 2.5rem - 1rem)",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="align-center w-full flex-1 items-center rounded bg-gray-200 align-middle">
                      <div
                        className={`w-0 ${
                          progressBar >= 4 && "bg-green-300"
                        } rounded py-1`}
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>

                  <div
                    className={`mx-auto h-10 w-10 ${
                      progressBar >= 4 && "bg-green-500"
                    } ${
                      progressBar < 4 && "border-2 border-gray-200"
                    } flex items-center rounded-full text-lg text-white`}
                  >
                    <span
                      className={`text-center ${
                        progressBar >= 4 ? "text-white" : "text-gray-600"
                      } w-full`}
                    >
                      <BsPencilSquare className="w-full fill-current" />
                    </span>
                  </div>
                </div>

                <div className="text-center text-xs md:text-base">Signed</div>
              </div>

              <div className="w-1/4">
                <div className="relative mb-2">
                  <div
                    className="align-center absolute flex content-center items-center align-middle"
                    style={{
                      width: "calc(100% - 2.5rem - 1rem)",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="align-center w-full flex-1 items-center rounded bg-gray-200 align-middle">
                      <div
                        className={`w-0 ${
                          progressBar >= 5 && "bg-green-300"
                        } rounded py-1`}
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>

                  <div
                    className={`mx-auto h-10 w-10 ${
                      progressBar >= 5 && "bg-green-500"
                    } ${
                      progressBar < 4 && "border-2 border-gray-200"
                    } flex items-center rounded-full text-lg text-white`}
                  >
                    <span
                      className={`text-center ${
                        progressBar >= 5 ? "text-white" : "text-gray-600"
                      } w-full`}
                    >
                      <AiOutlineCheckCircle className="w-full fill-current" />
                    </span>
                  </div>
                </div>

                <div className="text-center text-xs md:text-base">Finished</div>
              </div>
            </div>
          </div>

          <hr className="my-8 h-px w-[90%] border-0 bg-gray-200 dark:bg-gray-700" />

          <CardHeader>
            <CardTitle className="text-center">{contract.title}</CardTitle>
            <CardDescription className="text-center">
              <a
                href="https://google.com"
                className=" hover:underline"
                target="_blank"
              >
                Published By - {contract.contract_creator.company_name}
              </a>
            </CardDescription>
          </CardHeader>

          <div className="mt-10 flex w-full justify-between px-5">
            <Card className="w-1/2 border-0">
              <CardHeader>
                <CardTitle className="text-lg">Basic Info</CardTitle>
              </CardHeader>
              <CardDescription className="flex w-full flex-col px-6">
                <div className="my-1 flex w-full items-center justify-between text-lg">
                  <p className="text-bold mr-5 text-gray-700">Contract ID: </p>
                  <p>{contract.id}</p>
                </div>
                <div className="my-1 flex w-full items-center justify-between text-lg">
                  <p className="text-bold mr-5 text-gray-700">
                    Contract Duration:{" "}
                  </p>
                  <p>{contract.contract_duration}</p>
                </div>
                <div className="my-1 flex w-full items-center justify-between text-lg">
                  <p className="text-bold mr-5 text-gray-700">
                    Contract Renewal:{" "}
                  </p>
                  {contract.renewal ? (
                    <Badge
                      variant={"outline"}
                      className="bg-green-500 px-3 font-bold text-white"
                    >
                      Allowed
                    </Badge>
                  ) : (
                    <Badge
                      variant={"outline"}
                      className="bg-red-500 px-3 font-bold text-white"
                    >
                      Not Allowed
                    </Badge>
                  )}
                </div>
              </CardDescription>
            </Card>

            <Card className="w-1/2 border-0">
              <CardHeader>
                <CardTitle className="text-lg">Payment Info</CardTitle>
              </CardHeader>
              <CardDescription className="flex w-full flex-col px-6">
                <div className="my-1 flex w-full items-center justify-between text-lg">
                  <p className="text-bold mr-5 text-gray-700">
                    Payment Method:{" "}
                  </p>
                  <p>{contract.payment_method}</p>
                </div>
                <div className="my-1 flex w-full items-center justify-between text-lg">
                  <p className="text-bold mr-5 text-gray-700">Budget Range: </p>
                  <p>{contract.budget_range}</p>
                </div>
                <div className="my-1 flex w-full items-center justify-between text-lg">
                  <p className="text-bold mr-5 text-gray-700">
                    Agreed Amount:{" "}
                  </p>
                  <p>${contract.total_amount}</p>
                </div>
              </CardDescription>
            </Card>
          </div>

          <div className="mt-10 flex w-full justify-between px-5">
            <Card className="w-full border-0">
              <CardHeader>
                <CardTitle className="text-lg">Expertise Required</CardTitle>
              </CardHeader>
              <CardDescription className="flex w-full flex-wrap items-center px-8 py-5 ">
                {contract.skills_required.map((skill) => (
                  <Badge variant={"outline"} className="mr-10 scale-125 px-3">
                    {skill}
                  </Badge>
                ))}
              </CardDescription>
            </Card>
          </div>

          <div className="flex w-full justify-between px-5">
            <Card className="w-full border-0">
              <CardHeader>
                <CardTitle className="text-lg">Leagal Requirements</CardTitle>
              </CardHeader>
              <CardDescription className="flex w-full items-center px-6 py-5 ">
                <div className="h-10 w-full rounded-lg border-[1px] border-gray-300 bg-gray-50 px-5">
                  <p className="flex h-full items-center font-semibold text-gray-800">
                    {contract.legal_requirements}
                  </p>
                </div>
              </CardDescription>
            </Card>
          </div>

          <div className="flex w-full justify-between px-5">
            <Card className="w-full border-0">
              <CardHeader>
                <CardTitle className="text-lg">Contract Description</CardTitle>
              </CardHeader>
              <CardDescription className="flex w-full items-center px-6 py-5 text-black ">
                <Textarea disabled value={contract.description} />
              </CardDescription>
            </Card>
          </div>

          <div className="flex w-full justify-between px-5">
            <Card className="w-full border-0">
              <CardHeader>
                <CardTitle className="text-lg">Contract Files</CardTitle>
              </CardHeader>
              <CardDescription className="flex w-full items-center px-6 py-5 text-black ">
                <div className="flex max-w-[900px] overflow-x-scroll">
                  {contract.files.map((url) => (
                    <DocumentViewer
                      className="mx-5 min-w-[500px]"
                      documentUrl={url}
                    />
                  ))}
                </div>
              </CardDescription>
            </Card>
          </div>
        </Card>

        {contract !== undefined && contract.acceptedBidder !== null ? (
          <Card className="flex w-full flex-col items-center py-10">
            <CardHeader>
              <CardTitle className="text-center">BIDDER PROPOSAL</CardTitle>
              <CardDescription className="text-center">
                <a
                  href={contract.acceptedBidder.bidder.website}
                  className=" hover:underline"
                  target="_blank"
                >
                  Proposed By - {contract.acceptedBidder.bidder.company_name}
                </a>
              </CardDescription>
            </CardHeader>

            <div className="mt-10 flex w-full justify-between px-5">
              <Card className="w-full border-0">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {(
                      contract.acceptedBidder.bidder.company_name as string
                    ).toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardDescription className="flex min-w-full justify-between">
                  <div className="flex w-1/2 flex-col px-6">
                    <div className="my-1 flex w-full items-center justify-between text-lg">
                      <p className="text-bold mr-5 text-gray-700">
                        Proposal Id:{" "}
                      </p>
                      <p>{contract.acceptedBidder.id}</p>
                    </div>
                    <div className="my-1 flex w-full items-center justify-between text-lg">
                      <p className="text-bold mr-5 text-gray-700">
                        Based on (Location):{" "}
                      </p>
                      <p>{contract.acceptedBidder.bidder.country}</p>
                    </div>
                    <div className="my-1 flex w-full items-center justify-between text-lg">
                      <p className="text-bold mr-5 text-gray-700">
                        Experience:{" "}
                      </p>
                      <p>{contract.acceptedBidder.bidder.experience} Years</p>
                    </div>
                  </div>

                  <div className="flex w-1/2 flex-col px-6">
                    <div className="my-1 flex w-full items-center justify-between text-lg">
                      <p className="text-bold mr-5 text-gray-700">
                        Total Deliverables:{" "}
                      </p>
                      <p>10</p>
                    </div>
                    <div className="my-1 flex w-full items-center justify-between text-lg">
                      <p className="text-bold mr-5 text-gray-700">
                        Quotation:{" "}
                      </p>
                      <p>${contract.acceptedBidder.quotation_amount}</p>
                    </div>
                    <div className="my-1 flex w-full items-center justify-between text-lg">
                      <p className="text-bold mr-5 text-gray-700">
                        Bidder Website:{" "}
                      </p>
                      <a
                        href={contract.acceptedBidder.bidder.website}
                        target="_blank"
                      >
                        {contract.acceptedBidder.bidder.website}
                      </a>
                    </div>
                  </div>
                </CardDescription>
              </Card>
            </div>

            <div className="mt-7 flex w-full justify-center px-9">
              <div className="max-w grid w-full items-center gap-1.5">
                <Label htmlFor="picture" className="mb-2">
                  Proposal Description
                </Label>
                <Textarea
                  value={contract.acceptedBidder.proposalDescription as string}
                  disabled
                  placeholder="# Proposal Description"
                />
              </div>
            </div>

            <div className="flex w-full justify-between px-5">
              <Card className="w-full border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Proposal Files</CardTitle>
                </CardHeader>
                <CardDescription className="flex w-full items-center px-6 py-5 text-black ">
                  <div className="flex max-w-[900px] overflow-x-scroll">
                    {contract.acceptedBidder.files.map((url: string) => (
                      <DocumentViewer
                        className="mx-5 min-w-[500px]"
                        documentUrl={url}
                      />
                    ))}
                  </div>
                </CardDescription>
              </Card>
            </div>

            {progressBar === 2 && (
              <Button
                onClick={approveContract}
                type="button"
                className="w-[200px]"
              >
                Approve Contract
              </Button>
            )}
          </Card>
        ) : (
          <>
            <Card className="flex w-full flex-col items-center py-10">
              {viewBidder && bidderApplication !== null && (
                <>
                  <p className="my-10 text-center text-2xl font-bold">
                    Bidder Proposal
                  </p>
                  <div className="mt-10 flex w-full justify-between px-5">
                    <Card className="w-1/2 border-0">
                      <CardHeader>
                        <CardTitle className="text-lg">Bidder Info</CardTitle>
                      </CardHeader>
                      <CardDescription className="flex w-full flex-col px-6">
                        <div className="my-1 flex w-full items-center justify-between text-lg">
                          <p className="text-bold mr-5 text-gray-700">
                            Application ID:{" "}
                          </p>
                          <p>{bidderApplication.id}</p>
                        </div>
                        <div className="my-1 flex w-full items-center justify-between text-lg">
                          <p className="text-bold mr-5 text-gray-700">
                            Bidder Name:{" "}
                          </p>
                          <p>{bidderApplication.bidder.company_name}</p>
                        </div>
                      </CardDescription>
                    </Card>

                    <Card className="w-1/2 border-0">
                      <CardHeader>
                        <CardTitle className="mb-5 text-lg"></CardTitle>
                      </CardHeader>
                      <CardDescription className="flex w-full flex-col px-6">
                        <div className="my-1 flex w-full items-center justify-between text-lg">
                          <p className="text-bold mr-5 text-gray-700">
                            Country:{" "}
                          </p>
                          <p>{bidderApplication.bidder.country}</p>
                        </div>
                        <div className="my-1 flex w-full items-center justify-between text-lg">
                          <p className="text-bold mr-5 text-gray-700">
                            Experience:{" "}
                          </p>
                          <p>{bidderApplication.bidder.experience} Years</p>
                        </div>
                      </CardDescription>
                    </Card>
                  </div>
                  <div className="mt-10 flex w-full flex-col items-center px-8">
                    <div className="mt-7 flex w-full justify-center">
                      <div className="max-w grid w-full items-center gap-1.5">
                        <Label htmlFor="picture" className="mb-2">
                          Proposal Description
                        </Label>
                        <Textarea
                          value={
                            bidderApplication.proposalDescription !== null
                              ? bidderApplication.proposalDescription
                              : ""
                          }
                          disabled
                          placeholder="# Proposal Description"
                        />
                      </div>
                    </div>

                    <div className="flex w-full justify-between px-5">
                      <Card className="w-full border-0">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Proposal Files
                          </CardTitle>
                        </CardHeader>
                        <CardDescription className="flex w-full items-center px-6 py-5 text-black ">
                          <div className="flex max-w-[900px] overflow-x-scroll">
                            {bidderApplication.files.map((url) => (
                              <DocumentViewer
                                className="mx-5 min-w-[500px]"
                                documentUrl={url}
                              />
                            ))}
                          </div>
                        </CardDescription>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </Card>

            <ListBiddersTable
              setViewBidder={setViewBidder}
              acceptBidder={acceptBidder}
              data={contract.bidders as Bidder[]}
            />
          </>
        )}

        {progressBar === 4 && (
          <div className="mt-10 flex w-full justify-center">
            <Button
              type="button"
              onClick={uploadOnChain}
              className="flex w-[200px] items-center justify-center font-bold"
            >
              <AiOutlineUpload className="mr-2 text-lg" />
              Upload On Chain
            </Button>
          </div>
        )}
      </DashboardShell>
    </DashboardLayout>
  )
}

export default ContractDetailsPage
