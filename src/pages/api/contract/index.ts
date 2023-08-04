import { prisma } from "@/lib/db"
import { PrismaContract } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<
    | PrismaContract[]
    | PrismaContract
    | {
        err: string
      }
  >
) => {
  try {
    if (req.method === "GET") {
      const prismaContracts = await prisma.prismaContract.findMany({})

      return res.status(200).json(prismaContracts)
    } else if (req.method === "POST") {
      const { name } = req.body as {
        name?: string
      }

      if (!name) {
        throw new Error("Name is required")
      }

      const prismaContract = await prisma.prismaContract.create({
        data: {
          name: name,
        },
      })

      return res.status(200).json(prismaContract)
    } else {
      throw new Error("Invalid HTTP request, only GET and POST allowed")
    }
  } catch (e: any) {
    res.status(400).json({
      err: e?.message ?? "Bad request",
    })
  }
}

export default handler
