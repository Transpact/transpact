import { generateToken, verifyToken } from "@/lib/TokenAuth"
import { NextApiRequest, NextApiResponse } from "next"
import sha256 from "js-sha256"
import { prisma } from "@/lib/db"

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query
  let users

  if (action === "delete") {
    users = await prisma.user.deleteMany()
  } else {
    users = await prisma.user.findMany()
  }

  return res.status(200).json(users)
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  let { email, password } = req.body
  password = sha256.sha256(password)

  try {
    let user = await prisma.user.findFirst({
      where: {
        email,
        password,
      },
    })

    let token = generateToken(user.email, user.id)

    return res.status(200).json({ token: token })
  } catch {
    return res.status(401).json("INVALID CREDENTIALS")
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
