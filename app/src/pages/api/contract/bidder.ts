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


async function GET(req: NextApiRequest, res: NextApiResponse) {
  
  let user = getAuth(req);

  let filter = req.query.filter;

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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return GET(req, res)
  }
}
