import "regenerator-runtime/runtime";
import React, { useContext, useEffect, useState } from "react";

import { WalletContext } from "@/context/wallet-context";
import DashboardLayout from "@/components/layouts/dashboard-layout";

import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import { SAMPLE_CONTRACT } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/router";
import { server } from "@/lib/api-helper";
import { ENDPOINTS } from "@/lib/constants";
import { PrismaContract } from "@prisma/client";
import { FaFileContract } from "react-icons/fa";
import { AiOutlineUser, AiOutlineCheckCircle, AiOutlineArrowRight } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ContractDetailsPageProps {}

const ContractDetailsPage: React.FC<ContractDetailsPageProps> = ({}) => {
  
  const {} = useContext(WalletContext)!;
  const router = useRouter();
  const contractId = router.query.id;

  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<PrismaContract | null | undefined>(
    undefined
  );
  const [progressBar,setProgressBar] = useState<number>(1); 

  const getContracts = async () => {
    console.log("=====")
    setLoading(true);

    try {
      // TODO: Get from blockchain

      const res = await server.get(ENDPOINTS.bidder.getContracts + `?id=${contractId}`);
      
      const data = res.data.data as {
        contracts: PrismaContract[]
      }

      console.log(data.contracts,"=====")
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
  
  useEffect(() => {
    getContracts();
  }, [contractId]);

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
        <DashboardHeader heading={contract?.name ?? ""} text={""} />

        <Card className="w-full flex flex-col items-center py-10">

          {/* contract progress bar */}
          <div className="w-full py-6">
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
                      <div className={`w-0 ${progressBar >=4 && "bg-green-300" } py-1 rounded`} style={{"width": "100%"}}></div>
                    </div>
                  </div>

                  <div className={`w-10 h-10 mx-auto ${progressBar >= 4 && "bg-green-500" } ${progressBar <4 && "border-2 border-gray-200" } rounded-full text-lg text-white flex items-center`}>
                    <span className={`text-center ${progressBar >= 4 ? "text-white" : "text-gray-600" } w-full`}>
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
            <CardTitle className="text-center">Construction of H-34 Road.</CardTitle>
            <CardDescription className="text-center">
              <a href="https://google.com" className=" hover:underline" target="_blank">Published By - Bugheist Industries & CO</a>
            </CardDescription>
          </CardHeader>
          
          <div className="w-full px-5 mt-10 flex justify-between">
          <Card className="w-1/2 border-0">
              <CardHeader>
                <CardTitle className="text-lg">Basic Info</CardTitle>
              </CardHeader>
              <CardDescription className="w-full px-6 flex flex-col">
                  <div className="w-full justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Contract ID: </p>
                    <p>adsdd234234dfsad</p>
                  </div>
                  <div className="w-full justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Contract Duration: </p>
                    <p>10 - 12 Months</p>
                  </div>
                  <div className="w-full justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Contract Renewal: </p>
                    <Badge variant={'outline'} className="px-3 bg-green-500 font-bold text-white">Allowed</Badge>
                  </div>
              </CardDescription>
            </Card>

            <Card className="w-1/2 border-0">
              <CardHeader>
                <CardTitle className="text-lg">Payment Info</CardTitle>
              </CardHeader>
              <CardDescription className="w-full px-6 flex flex-col">
                  <div className="w-full justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Payment Method: </p>
                    <p>Transpact Wallet</p>
                  </div>
                  <div className="w-full justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Budget Range: </p>
                    <p>$500k - $600k</p>
                  </div>
                  <div className="w-full justify-between flex items-center text-lg">
                    <p className="text-gray-700 text-bold mr-5">Aggreed Amount: </p>
                    <p>$1000000</p>
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
                  <p className="flex h-full items-center">Leagelly eligible for doing transactions.</p>
                </div>
              </CardDescription>
            </Card>
          </div>
          

          <div className="w-full px-5 flex justify-between">
            <Card className="w-full border-0">
              <CardHeader>
                <CardTitle className="text-lg">Contract Description</CardTitle>
              </CardHeader>
              <CardDescription className="w-full flex items-center py-5 px-6 ">
                <Textarea disabled value={"dasjda daskjd; alsd;kals d;ajsd ajsdk; asd"}/>
              </CardDescription>
            </Card>
          </div>
              
          <div className="w-full flex justify-center mt-10">
            <div className="flex items-center space-x-2">
              <Input type="number" className="w-[60%]" placeholder="Your Quotation (USD)" />
              <Button className="w-[200px]">Apply as Bidder</Button>
            </div>
          </div>

        </Card>

        {/* <div className="grid grid-cols-2">
          <p>
            <span className="font-bold">START: </span>{" "}
            {formatDate(contract?.startDate ?? new Date())}
          </p>

          <p>
            <span className="font-bold">DEADLINE: </span>{" "}
            {formatDate(contract?.endDate ?? new Date())}
          </p>

          <p>
            <span className="font-bold">BUDGET: </span> ${contract?.budget_range}
          </p>
        </div>

        <p className="mt-6">{contract?.description}</p> */}
      </DashboardShell>
    </DashboardLayout>
  );
};

export default ContractDetailsPage;
