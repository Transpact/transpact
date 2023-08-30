import { handleError, handleResponse } from "@/lib/api-helper"
import { prisma } from "@/lib/db"
import { getAuth, SignedOutAuthObject, SignedInAuthObject } from "@clerk/nextjs/server"
import type { NextApiRequest, NextApiResponse } from "next"


async function getMyContracts(user:  SignedInAuthObject | SignedOutAuthObject){

    const contracts = await prisma.contract.findMany({
        where: {
          bidders: {
            some:{
                id: user.userId?.toString()
            }
          }
        }
      })
    
    
    return contracts;
}

async function getAllContracts(user:  SignedInAuthObject | SignedOutAuthObject){


    const contracts = await prisma.contract.findMany({
      include: {
        bidders: true,
      }
    });
    return contracts;


}

async function getContract(user:  SignedInAuthObject | SignedOutAuthObject, _id: String) {

  const contract = await prisma.contract.findFirst({
    where:{
      id: _id
    },
    include:{
      contract_creator: {
        select:{
          company_name: true,
        }
      }
    }
  });
  
  const alreadyBidded = await prisma.contract.findFirst({
    where:{
      id: _id,
      bidders: {
        some:{
          bidderId: user.userId
        }
      }   
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

  let filter = req.query.filter;
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
      },
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

    if ( filter === "all" ){

        let all_contracts = await getAllContracts(user); 
    
        return handleResponse({
            res,
            message: "",
            data: {
                contracts: all_contracts
            },
        })
      }
    
    else if ( filter === "my" ){

        let my_contracts = await getMyContracts(user);
        
        return handleResponse({
            res,
            message: "",
            data: {
                contracts: my_contracts
            },
        })
    }

    if ( filter_by_id ){
      
      let my_contract = await getContract(user,filter_by_id);
      
      return handleResponse({
          res,
          message: "",
          data: {
              contracts: my_contract
          },
      })
    }

    else {
        return handleError({
            res,
            statusCode: 400,
            data: {},
            message: "Invalid filter passed",
        })
    }

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

    const contract_id = req.query.id as String;
    const data = req.body;

    const bidderApplicationExist = await prisma.bidderApplication.findFirst({
      where:{
        bidderId: user.userId
      }
    })

    if ( bidderApplicationExist ){
      return handleError({
        res,
        statusCode: 400,
        data: {},
        message: "Bidder already applied.",
      })
    }

    const bidderApplication = await prisma.bidderApplication.create({
      data:{
        quotation_amount: data.quotation_amount,
        bidder: {
          connect:{
            id: user.userId
          }
        }
      }
    })

    await prisma.contract.update({
      where:{
        id: contract_id,
      },
      data:{
        bidders: {
          connect: [{ id: bidderApplication.id }]
        }
      }
    })

    return handleResponse({
      res,
      statusCode:201,
      message: "Successfully Bidded!",
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

    case "PUT":
      return POST(req,res)
  }
}
