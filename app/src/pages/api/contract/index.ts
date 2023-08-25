import { prisma } from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"
import type { NextApiRequest, NextApiResponse } from "next"

async function POST(req: NextApiRequest, res: NextApiResponse) {
  let user = getAuth(req)
  const contractDetails = req.body

  if (user == null) {
    return res.status(401).json("UNAUTHORISED_USER")
  }

  try {
    let userExists = await prisma.user.findFirst({
      where: {
        id: user.userId as string,
      },
    })

    if (!userExists) {
      return res.status(401).json("USER_DOES_NOT_EXISTS")
    }

    let contract = await prisma.contract.create({
      data: {
        ...contractDetails,
        contract_creator: {
          connect: {
            id: userExists.id,
          },
        },
        bidders: {
          connect: {
            id: userExists.id,
          },
        },
      },
    })

    return res.status(200).json(contract)
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // case "GET":
    //   GET(req, res)
    //   break
    case "POST":
      return POST(req, res)

    // case "PUT":
    //   PUT(req, res)
    //   break
  }
}
