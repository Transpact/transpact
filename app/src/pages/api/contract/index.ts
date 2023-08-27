import { handleError, handleResponse } from "@/lib/api-helper"
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

async function GET(req: NextApiRequest, res: NextApiResponse) {
  let user = getAuth(req)

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

    const contracts = await prisma.contract.findMany({
      where: {
        creatorId: user.userId,
      },
    })

    return handleResponse({
      res,
      message: "",
      data: {
        contracts,
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return GET(req, res)
    case "POST":
      return POST(req, res)
  }
}
