import { AccountSetup } from "@/lib/Near"
import { handleError, handleResponse } from "@/lib/api-helper"
import { getAuth } from "@clerk/nextjs/server"
import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/db"



async function GET(req: NextApiRequest, res: NextApiResponse){

    let user = getAuth(req);
    const contract_id = req.query.id as string;
        
    if (!user || !user.userId) {
        return handleError({
          res,
          statusCode: 401,
          data: {},
          message: "You are not authorised",
        })
    }

    try{

        const [account, smart_contract] = await AccountSetup();

        const contract = await prisma.contract.findFirst({
            where: {
                creatorId: user.userId,
                id: contract_id
            },
            include: {
                acceptedBidder: true,
                contract_creator: true
            }
        })

        if (contract === null){
            return handleError({
                res,
                statusCode: 404,
                data: null,
                message: "Contract does not exists",
            })
        }
        
        let resp1 = await smart_contract.create_contract(
            {
                id: contract.id,
                contract_type: contract.contract_type as string,
                status: contract.status as string,
                title: contract.title,
                legal_requirements: contract.legal_requirements,
                payment_method: contract.payment_method as string,
                total_amount: contract.total_amount,
                renewal: contract.renewal,
                description: contract.description,
                contract_duration: contract.contract_duration,
                budget_range: contract.budget_range,
                creator_id: contract.creatorId,
                accepted_bidder: {
                    id: contract.acceptedBidder?.id,
                    quotation_amount: contract.acceptedBidder?.quotation_amount,
                    bidder_id: contract.acceptedBidder?.bidderId,
                    proposal_description: contract.acceptedBidder?.proposalDescription,
                    files: contract.acceptedBidder?.files
                } ,
                skills_required: ["hello","hi"],
                files: ["hello","hi"]
            }
        )
            
        
        let resp2 = await smart_contract.get_contract({
            contract_id: contract_id
        })
        
        console.log(resp2)

        return handleResponse({
            res,
            message: "",
            data: contract,
        })


    } catch (error: any) {
        return handleError({
            res,
            statusCode: 400,
            data: {},
            message: error?.message ?? "Failed to fetch contracts",
        })
    } 

}



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
      case "GET":
        return GET(req, res)
    //   case "POST":
    //     return POST(req, res)
    }
  }
  