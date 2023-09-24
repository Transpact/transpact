'use client';

import React, { useContext, useEffect, useState } from "react";

import { WalletContext } from "@/context/wallet-context";
import DashboardLayout from "@/components/layouts/dashboard-layout";

import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";


import { useRouter } from "next/router";
import { server, showAxiosError } from "@/lib/api-helper";
import { ENDPOINTS } from "@/lib/constants";
import { FaFileContract } from "react-icons/fa";
import { AiOutlineUser, AiOutlineCheckCircle, AiOutlineArrowRight, AiOutlineUpload } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import ListBiddersTable, { Bidder } from "@/components/lister/ListBiddersTable";
import { BidderApplication, Contract } from "~/types/models";
import { DocumentViewer } from "@/components/generic/doc-viewer"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ContractDetailsPageProps {}

const ContractDetailsPage: React.FC<ContractDetailsPageProps> = ({}) => {
  
  const {} = useContext(WalletContext)!;
  const router = useRouter();
  const contractId = router.query.id;

  const [loading, setLoading] = useState<boolean>(false);
  const [quotationAmount,setQuotationAmount] = useState<number>(0);

  const [contract, setContract] = useState<Contract | null | undefined>(
    undefined
  );
  const [progressBar,setProgressBar] = useState<number>(1); 
  const [ bidderAccepted,setBidderAccepted ] = useState<boolean>(false);
  
  const [ bidderApplication, setBidderApplication ] = React.useState<BidderApplication | null>(null);
  const [viewBidder,setViewBidder] = useState<string | null>(null);

  const [contractValidated, setContractValidated] = React.useState<number>(0);


  const getContract = async () => {

    setLoading(true);

    try {
      // TODO: Get from blockchain

      const res = await server.get(ENDPOINTS.lister.contract + `?id=${contractId}`);
      
      const data = res.data.data as {
        contracts: Contract
      }
      switch (data.contracts.payment_method) {
        case "BANK_TRANSFER":
          data.contracts.payment_method = "Bank Transfer"
          break;
        
        case "TRANSPACT_FUND_WALLET":
          data.contracts.payment_method = "Transpact Fund Wallet"
          break;

        case "BANK_TRANSFER":
          data.contracts.payment_method = "Cash"
          break;

      }
      setQuotationAmount(data.contracts.total_amount);
      setContract(data.contracts);

      switch (data.contracts.status as String){

        case "CREATED":
          setProgressBar(1);
          break;

        case "BIDDER_FOUND":
          setProgressBar(2);
          break;
          
        case "APPROVED":
          setProgressBar(3);
          break;
          
        case "SIGNED":
          setProgressBar(4);
          break;
        
        case "FINISHED":
          setProgressBar(5);
          break;
      }

    } catch (e) {
      setContract(null);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  async function acceptBidder(bidderApplicationId:string) {

    try{

      const resp = await server.post(ENDPOINTS.lister.contract+`?id=${contractId}&application=${bidderApplicationId}`)

      toast({
        title: "Bidder Accepted!",
        description: "Bidder has been accepted and notification has been sent.",
        variant: "default",
      })

      setBidderAccepted(true);

    } catch (e: any) {
      
      const error = e as AxiosError

      showAxiosError({
        error,
        generic: "Failed to accept bidder",
        additionalText: "Please try to login again",
      })
    
    }
  }

  async function approveContract(){

    try{

      setLoading(true);
      
      await server.put(
        ENDPOINTS.lister.contract+`?id=${contractId}`,
        {
          status: "APPROVED"
        },
        {
          headers:{
              'Content-Type': 'application/json'
          }
        } 
      )

      toast({
        title: "Bidder Proposal Approved",
        description: "Bidder Proposal has been accepted and notification has been sent.",
        variant: "default",
      })

      setBidderAccepted(true);

    } catch (e: any) {
      
      const error = e as AxiosError

      showAxiosError({
        error,
        generic: "Failed to accept bidder",
        additionalText: "Please try to login again",
      })
    
    } finally{
      setLoading(false)
    }

  }


  async function uploadOnChain(){

    try {

      setLoading(true);

      await server.post(ENDPOINTS.onChain.uploadContact + `?id=${contractId}`);

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
    
    } finally{
      setLoading(false)
    }

  }


  async function validateContract(){
    
    try {

      const res = await server.get(ENDPOINTS.onChain.uploadContact + `?id=${contractId}`);
      let validation = res.data.data;

      console.log("=======")
      // 1 -> VALIDATED
      // 2 -> INVALID
      // 3 -> Server / network error

      if ( validation === "VALID" ) {
        setContractValidated(1);
      } 

      else {
        setContractValidated(2);
      }

    } catch (e) {
      setContractValidated(3);
    }
    
  }

  async function getBidderApplication(){

    try {

      const res = await server.get(ENDPOINTS.bidder.application + `?bidder_application_id=${viewBidder}`);
      
      const data = res.data.data as BidderApplication
      setBidderApplication(data);
    } catch (e) {
      setBidderApplication(null);
      console.log(e);
    } finally {
      setLoading(false);
    }

  }

  
  useEffect(() => {
    getContract();
  }, [bidderAccepted]);

  useEffect(()=>{
    getBidderApplication()
  },[viewBidder])

  useEffect(()=>{

    if (progressBar == 5) {
      validateContract()
    }

  },[progressBar])

  if (contract === null || contract === undefined) {
    return <p>Loading</p>;
  }
  
  return (
    <DashboardLayout
      type="none"
      loading={loading || contract === undefined}
      heading="Contract Info"
      text="View and bid for contract"
      buttonLabel=""
    >
      <DashboardShell>

        <Card className="w-full flex flex-col items-center py-10">

          {/* contract progress bar */}
          <div className="w-full">
            <div className="w-full flex justify-end items-center mb-5 pr-10">
              {
                contractValidated === 0 && 
                <div title="Validated" className="w-3 h-3 p-[1px] bg-yellow-500 rounded-full animate-spin">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              }

              {
                contractValidated === 1 && 
                <div title="Validated" className="w-3 h-3 p-[1px] bg-green-500 rounded-full"></div>
              }
              {
                contractValidated === 2 && 
                <div title="Invalid" className="w-3 h-3 p-[1px] bg-red-500 rounded-full"></div>
              }
              {
                contractValidated === 3 && 
                <div title="Network Error" className="w-3 h-3 p-[1px] bg-yellow-500 rounded-full"></div>
              }
            </div>
            <div className="flex">
              <div className="w-1/4">
                <div className="relative mb-2">
                  <div className="w-10 h-10 mx-auto bg-green-500 rounded-full text-lg text-white flex items-center">
                    <span className="text-center text-white w-full">
                      <FaFileContract className="w-full fill-current"/>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-center md:text-base">Initiated</div>
              </div>

              <div className="w-1/4">
                <div className="relative mb-2">
                  <div className="absolute flex align-center items-center align-middle content-center" style={{ "width": "calc(100% - 2.5rem - 1rem)", "top": "50%", "transform": "translate(-50%, -50%)"}}>
                    <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                      <div className={`w-0 py-1 ${progressBar >=2 && "bg-green-300" } rounded`} style={{width: "100%"}}></div>
                    </div>
                  </div>

                  <div className={`w-10 h-10 mx-auto ${progressBar >= 2 && "bg-green-500" } ${progressBar <2 && "border-2 border-gray-200" } rounded-full text-lg text-white flex items-center`}>
                    <span className={`text-center ${progressBar >= 2 ? "text-white" : "text-gray-600" } w-full`}>
                    <AiOutlineUser className="w-full fill-current"/> 
                    </span>
                  </div>
                </div>

                <div className="text-xs text-center md:text-base">Bidder Found</div>
              </div>

              <div className="w-1/4">
                <div className="relative mb-2">
                  <div className="absolute flex align-center items-center align-middle content-center" style={{"width": "calc(100% - 2.5rem - 1rem)", "top": "50%", "transform": "translate(-50%, -50%)" }}>
                    <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                      <div className={`w-0 ${progressBar >=3 && "bg-green-300" } py-1 rounded`} style={{"width": "100%"}}></div>
                    </div>
                  </div>

                  <div className={`w-10 h-10 mx-auto ${progressBar >= 3 && "bg-green-500" } ${progressBar <3 && "border-2 border-gray-200" } rounded-full text-lg text-white flex items-center`}>
                    <span className={`text-center ${progressBar >= 3 ? "text-white" : "text-gray-600" } w-full`}>
                    <AiOutlineArrowRight className="w-full fill-current"/>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-center md:text-base">Proposal Approved</div>
              </div>

              <div className="w-1/4">
                <div className="relative mb-2">
                  <div className="absolute flex align-center items-center align-middle content-center" style={{ "width": "calc(100% - 2.5rem - 1rem)", "top": "50%", "transform": "translate(-50%, -50%)" }}>
                    <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                      <div className={`w-0 ${progressBar >=4 && "bg-green-300" } py-1 rounded`} style={{"width": "100%"}}></div>
                    </div>
                  </div>

                  <div className={`w-10 h-10 mx-auto ${progressBar >= 4 && "bg-green-500" } ${progressBar <4 && "border-2 border-gray-200" } rounded-full text-lg text-white flex items-center`}>
                    <span className={`text-center ${progressBar >= 4 ? "text-white" : "text-gray-600" } w-full`}>
                    <BsPencilSquare className="w-full fill-current"/>  
                    </span> 
                  </div>
                </div>

                <div className="text-xs text-center md:text-base">Signed</div>
              </div>

              <div className="w-1/4">
                <div className="relative mb-2">
                  <div className="absolute flex align-center items-center align-middle content-center" style={{ "width": "calc(100% - 2.5rem - 1rem)", "top": "50%", "transform": "translate(-50%, -50%)" }}>
                    <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                      <div className={`w-0 ${progressBar >=5 && "bg-green-300" } py-1 rounded`} style={{"width": "100%"}}></div>
                    </div>
                  </div>

                  <div className={`w-10 h-10 mx-auto ${progressBar >= 5 && "bg-green-500" } ${progressBar <4 && "border-2 border-gray-200" } rounded-full text-lg text-white flex items-center`}>
                    <span className={`text-center ${progressBar >= 5 ? "text-white" : "text-gray-600" } w-full`}>
                    <AiOutlineCheckCircle className="w-full fill-current"/>  
                    </span> 
                  </div>
                </div>

                <div className="text-xs text-center md:text-base">Finished</div>
              </div>

            </div>
          </div>

          <hr className="h-px w-[90%] my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

          <CardHeader>
            <CardTitle className="text-center">{contract.title}</CardTitle>
            <CardDescription className="text-center">
              <a href="https://google.com" className=" hover:underline" target="_blank">Published By - {contract.contract_creator.company_name}</a>
            </CardDescription>
          </CardHeader>
          
          <div className="w-full px-5 mt-10 flex justify-between">
          <Card className="w-1/2 border-0">
              <CardHeader>
                <CardTitle className="text-lg">Basic Info</CardTitle>
              </CardHeader>
              <CardDescription className="w-full px-6 flex flex-col">
                  <div className="w-full my-1 justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Contract ID: </p>
                    <p>{contract.id}</p>
                  </div>
                  <div className="w-full my-1 justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Contract Duration: </p>
                    <p>{contract.contract_duration}</p>
                  </div>
                  <div className="w-full my-1 justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Contract Renewal: </p>
                    {
                      contract.renewal 
                       
                      ? <Badge variant={'outline'} className="px-3 bg-green-500 font-bold text-white">Allowed</Badge>
                      : <Badge variant={'outline'} className="px-3 bg-red-500 font-bold text-white">Not Allowed</Badge>
                    }
                  </div>
              </CardDescription>
            </Card>

            <Card className="w-1/2 border-0">
              <CardHeader>
                <CardTitle className="text-lg">Payment Info</CardTitle>
              </CardHeader>
              <CardDescription className="w-full px-6 flex flex-col">
                  <div className="w-full my-1 justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Payment Method: </p>
                    <p>{contract.payment_method}</p>
                  </div>
                  <div className="w-full my-1 justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Budget Range: </p>
                    <p>{contract.budget_range}</p>
                  </div>
                  <div className="w-full my-1 justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Agreed Amount: </p>
                    <p>${contract.total_amount}</p>
                  </div>
              </CardDescription>
            </Card> 
          </div>

          <div className="w-full px-5 mt-10 flex justify-between">
            <Card className="w-full border-0">
              <CardHeader>
                <CardTitle className="text-lg">Expertise Required</CardTitle>
              </CardHeader>
              <CardDescription className="w-full py-5 px-8 flex items-center flex-wrap ">
                  {
                    contract.skills_required.map((skill) => <Badge variant={'outline'} className="scale-125 mr-10 px-3">{skill}</Badge>)
                  }
              </CardDescription>
            </Card>
          </div>

          <div className="w-full px-5 flex justify-between">
            <Card className="w-full border-0">
              <CardHeader>
                <CardTitle className="text-lg">Leagal Requirements</CardTitle>
              </CardHeader>
              <CardDescription className="w-full flex items-center py-5 px-6 ">
                <div className="w-full h-10 border-[1px] px-5 border-gray-300 bg-gray-50 rounded-lg">
                  <p className="flex h-full items-center text-gray-800 font-semibold">{contract.legal_requirements}</p>
                </div>
              </CardDescription>
            </Card>
          </div>
          

          <div className="w-full px-5 flex justify-between">
            <Card className="w-full border-0">
              <CardHeader>
                <CardTitle className="text-lg">Contract Description</CardTitle>
              </CardHeader>
              <CardDescription className="w-full text-black flex items-center py-5 px-6 ">
                <Textarea disabled value={contract.description}/>
              </CardDescription>
            </Card>
          </div>  

          <div className="w-full px-5 flex justify-between">
            <Card className="w-full border-0">
              <CardHeader>
                <CardTitle className="text-lg">Contract Files</CardTitle>
              </CardHeader>
              <CardDescription className="w-full text-black flex items-center py-5 px-6 ">
              <div className="flex max-w-[900px] overflow-x-scroll">
                {
                  contract.files.map((url)=><DocumentViewer className="min-w-[500px] mx-5" documentUrl={url}/>)
                }        
              </div>
              </CardDescription>
            </Card>
          </div>  

        </Card>

        {
          contract !== undefined && contract.acceptedBidder !== null
          
          ?
          
          <Card className="w-full flex flex-col items-center py-10">
            
            <CardHeader>
              <CardTitle className="text-center">BIDDER PROPOSAL</CardTitle>
              <CardDescription className="text-center">
                <a href={contract.acceptedBidder.bidder.website} className=" hover:underline" target="_blank">Proposed By - {contract.acceptedBidder.bidder.company_name}</a>
              </CardDescription>
            </CardHeader>

            <div className="w-full px-5 mt-10 flex justify-between">
              <Card className="w-full border-0">
                <CardHeader>
                  <CardTitle className="text-lg">{(contract.acceptedBidder.bidder.company_name as string).toUpperCase()}</CardTitle>
                </CardHeader>
                <CardDescription className="min-w-full flex justify-between">
                  <div className="w-1/2 px-6 flex flex-col">
                    <div className="w-full my-1 justify-between flex items-center text-lg">
                      <p className="text-gray-700 text-bold mr-5">Proposal Id: </p>
                      <p>{contract.acceptedBidder.id}</p>
                    </div>
                    <div className="w-full my-1 justify-between flex items-center text-lg">
                      <p className="text-gray-700 text-bold mr-5">Based on (Location): </p>
                      <p>{contract.acceptedBidder.bidder.country}</p>
                    </div>
                    <div className="w-full my-1 justify-between flex items-center text-lg">
                      <p className="text-gray-700 text-bold mr-5">Experience: </p>
                      <p>{contract.acceptedBidder.bidder.experience} Years</p>
                    </div>
                  </div>

                  <div className="w-1/2 px-6 flex flex-col">
                    <div className="w-full my-1 justify-between flex items-center text-lg">
                      <p className="text-gray-700 text-bold mr-5">Total Deliverables: </p>
                      <p>10</p>
                    </div>
                    <div className="w-full my-1 justify-between flex items-center text-lg">
                      <p className="text-gray-700 text-bold mr-5">Quotation: </p>
                      <p>${contract.acceptedBidder.quotation_amount}</p>
                    </div>
                    <div className="w-full my-1 justify-between flex items-center text-lg">
                      <p className="text-gray-700 text-bold mr-5">Bidder Website: </p>
                      <a href={contract.acceptedBidder.bidder.website} target="_blank">{contract.acceptedBidder.bidder.website}</a>
                    </div>
                  </div>
                </CardDescription>
              </Card>
            </div>

            <div className="flex px-9 justify-center w-full mt-7">
              <div className="grid w-full max-w items-center gap-1.5">
                <Label htmlFor="picture" className="mb-2">Proposal Description</Label>
                <Textarea
                  value={ contract.acceptedBidder.proposalDescription as string}
                  disabled
                  placeholder="# Proposal Description"
                />
              </div>
            </div>

            <div className="w-full px-5 flex justify-between">
              <Card className="w-full border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Proposal Files</CardTitle>
                </CardHeader>
                <CardDescription className="w-full text-black flex items-center py-5 px-6 ">
                <div className="flex max-w-[900px] overflow-x-scroll">
                  {
                    contract.acceptedBidder.files.map((url:string)=><DocumentViewer className="min-w-[500px] mx-5" documentUrl={url}/>)
                  }        
                </div>
                </CardDescription>
              </Card>
            </div>  

            {
              progressBar === 2 &&
              <Button onClick={approveContract} type="button" className="w-[200px]">
                Approve Contract              
              </Button> 
            }

          </Card>

          :

          <>
          
          <Card className="w-full flex flex-col items-center py-10">
            {
              viewBidder && bidderApplication !== null &&
              <>
                <p className="text-2xl my-10 font-bold text-center">Bidder Proposal</p>
                <div className="w-full px-5 mt-10 flex justify-between">
                  <Card className="w-1/2 border-0">
                      <CardHeader>
                        <CardTitle className="text-lg">Bidder Info</CardTitle>
                      </CardHeader>
                      <CardDescription className="w-full px-6 flex flex-col">
                          <div className="w-full my-1 justify-between flex items-center text-lg">
                            <p className="text-gray-700 text-bold mr-5">Application ID: </p>
                            <p>{bidderApplication.id}</p>
                          </div>
                          <div className="w-full my-1 justify-between flex items-center text-lg">
                            <p className="text-gray-700 text-bold mr-5">Bidder Name: </p>
                            <p>{bidderApplication.bidder.company_name}</p>
                          </div>
                      </CardDescription>
                  </Card>

                  <Card className="w-1/2 border-0">
                    <CardHeader>
                      <CardTitle className="text-lg mb-5"></CardTitle>
                    </CardHeader>
                    <CardDescription className="w-full px-6 flex flex-col">
                        <div className="w-full my-1 justify-between flex items-center text-lg">
                          <p className="text-gray-700 text-bold mr-5">Country: </p>
                          <p>{bidderApplication.bidder.country}</p>
                        </div>
                        <div className="w-full my-1 justify-between flex items-center text-lg">
                          <p className="text-gray-700 text-bold mr-5">Experience: </p>
                          <p>{bidderApplication.bidder.experience} Years</p>
                        </div>
                    </CardDescription>
                  </Card> 

                </div>
                <div className="w-full px-8 mt-10 flex flex-col items-center">
                  <div className="flex justify-center w-full mt-7">
                    <div className="grid w-full max-w items-center gap-1.5">
                      <Label htmlFor="picture" className="mb-2">Proposal Description</Label>
                      <Textarea
                        value={bidderApplication.proposalDescription !== null ? bidderApplication.proposalDescription : "" }
                        disabled
                        placeholder="# Proposal Description"
                      />
                    </div>
                  </div>

                  <div className="w-full px-5 flex justify-between">
                    <Card className="w-full border-0">
                      <CardHeader>
                        <CardTitle className="text-lg">Proposal Files</CardTitle>
                      </CardHeader>
                      <CardDescription className="w-full text-black flex items-center py-5 px-6 ">
                      <div className="flex max-w-[900px] overflow-x-scroll">
                        {
                          bidderApplication.files.map((url)=><DocumentViewer className="min-w-[500px] mx-5" documentUrl={url}/>)
                        }        
                      </div>
                      </CardDescription>
                    </Card>
                  </div>  

                </div>
              </>

            }
          </Card>

          <ListBiddersTable setViewBidder={setViewBidder} acceptBidder={acceptBidder} data={ contract.bidders as Bidder[]} />
          </>

        }    

        {
          progressBar === 4 &&
          <div className="w-full flex justify-center mt-10">
              <Button type="button" onClick={uploadOnChain} className="w-[200px] flex items-center justify-center font-bold">
                <AiOutlineUpload className="text-lg mr-2" />
                Upload On Chain             
              </Button>
          </div>
        }     
        
      </DashboardShell>
    </DashboardLayout>
  );
};

export default ContractDetailsPage;
