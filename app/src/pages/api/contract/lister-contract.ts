import { handleError, handleResponse } from "@/lib/api-helper"
import { prisma } from "@/lib/db"
import { getAuth, SignedOutAuthObject, SignedInAuthObject } from "@clerk/nextjs/server"
import type { NextApiRequest, NextApiResponse } from "next"


async function getContract(user:  SignedInAuthObject | SignedOutAuthObject, _id: String) {

  const contract = await prisma.contract.findFirst({
    where:{
      id: _id as string
    },
    include:{
      contract_creator: {
        select:{
          company_name: true,
        }
      },
      acceptedBidder: {
        select:{
          id: true,
          quotation_amount: true,
          bidder: {
              select:{
                  id: true,
                  email: true,
                  country: true,
                  company_name: true,
                  company_logo: true,
                  experience: true,
                  website: true
              }
          },
        files: true,
        proposalDescription: true
        }
      },
      bidders:{
        select:{
            id: true,
            quotation_amount: true,
            bidder: {
                select:{
                    id: true,
                    email: true,
                    country: true,
                    company_name: true,
                    company_logo: true,
                    experience: true,
                    website: true
                }
            }
        }
      }
    }
  });
  
  const alreadyBidded = await prisma.bidderApplication.findFirst({
    where:{
      contractId: _id as string,
      bidderId: user.userId as string
    },
    select: {
      id: true,
    },
  })

  if (alreadyBidded === null){
    contract.already_bidded = false;
  }
  else{
    contract.already_bidded = true;
  }

  return contract;

}


async function GET(req: NextApiRequest, res: NextApiResponse) {
  
  let user = getAuth(req);

  let filter_by_id = req.query.id as String;

  if (!user || !user.userId) {
    return handleError({
      res,
      statusCode: 401,
      data: {},
      message: "You are not authorised",
    })
  }

  try {
    let userExists = await prisma.user.findFirst({
      where: {
        id: user.userId as string,
      }
    })

    if (!userExists) {
      return handleError({
        res,
        statusCode: 400,
        data: {
          user_completed: false,
        },
        message: "The user does not exists",
      })
    }


      
    let my_contract = await getContract(user,filter_by_id);
    
    return handleResponse({
        res,
        message: "",
        data: {
            contracts: my_contract
        },
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

async function POST(req: NextApiRequest, res: NextApiResponse){

    let user = getAuth(req);

    if (!user || !user.userId) {
      return handleError({
        res,
        statusCode: 401,
        data: {},
        message: "You are not authorised",
      })
    }
  
    try{
  
      const contract_id = req.query.id as string;
      const bidder_application = req.query.application as string;

      let bidderApplication = await prisma.bidderApplication.findFirst({
        where:{
          id: bidder_application
        }
      })
  
      if ( bidderApplication === null ){
    
        return handleError({
          res,
          statusCode:404,
          message: "Bidder application not found.",
          data: {},
        })
  
      }
    
    await prisma.contract.update({
        where:{
            id: contract_id
        },
        data:{
            status: "BIDDER_FOUND",
            acceptedBidder:{
                connect:{
                    id: bidderApplication.id
                }
            }
        }
    })



    return handleResponse({
        res,
        statusCode:200,
        message: "Bidder Accepted!",
        data: {},
    })
  
      
  
  
    } catch (error: any) {

      return handleError({
        res,
        statusCode: 400,
        data: {},
        message: error?.message ?? "Failed to update contract",
      })
    }
  
}


async function PUT(req: NextApiRequest, res: NextApiResponse){

  let user = getAuth(req);

  if (!user || !user.userId) {
    return handleError({
      res,
      statusCode: 401,
      data: {},
      message: "You are not authorised",
    })
  }

  try{

    const contract_id = req.query.id as string;
    const data = req.body;

    await prisma.contract.update({
        where:{
            id: contract_id
        },
        data: data
    })
    
    return handleResponse({
        res,
        statusCode:200,
        message: "Contract Updated!",
        data: {},
    })

  } catch (error: any) {

    return handleError({
      res,
      statusCode: 400,
      data: {},
      message: error?.message ?? "Failed to update contract",
    })
  }

}


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return GET(req, res)
    case "POST":{
        return POST(req,res)
    }
    case "PUT":{
      return PUT(req,res)
    }
  }
}
