import { handleError, handleResponse } from "@/lib/api-helper"
import { prisma } from "@/lib/db"
import { getAuth, SignedOutAuthObject, SignedInAuthObject } from "@clerk/nextjs/server"
import type { NextApiRequest, NextApiResponse } from "next"




async function GET(req: NextApiRequest, res: NextApiResponse) {
  
  let user = getAuth(req);

  const contractId = req.query.contract as string;

  if (!user || !user.userId) {
    return handleError({
      res,
      statusCode: 401,
      data: {},
      message: "You are not authorised",
    })
  }

  try {
    
    const bidder_application = await prisma.bidderApplication.findFirst({
        where:{
            contractId: contractId,
            bidderId: user.userId
        },
        include:{
            bidder:{
                select:{
                    id: true,
                    company_name: true,
                    company_logo: true,
                    email: true,
                    country: true,
                    website: true,
                    experience: true
                }
            }
        }
    })
    
    return handleResponse({
        res,
        message: "",
        data: bidder_application,
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

    // case "POST":
    //   return POST(req,res)
  }
}
