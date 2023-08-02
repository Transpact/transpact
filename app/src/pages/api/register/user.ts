import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"

async function GET(req: NextApiRequest, res: NextApiResponse) {
  let user = getAuth(req)

  if (user === null) {
    return res.status(401).json("UNAUTHORISED_USER")
  }

  try {
    const alreadyExists = await prisma.user.findFirst({
      where: {
        id: user.userId as string,
      },
    })

    if (!alreadyExists) {
      return res.status(200).json({ user_completed: false })
    }

    if (alreadyExists.user_completed) {
      return res.status(200).json({ user_completed: true })
    } else {
      return res.status(200).json({ user_completed: false })
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }

  // const users = await prisma.user.deleteMany();

  // return res.status(200).json(users);
}
async function POST(req: NextApiRequest, res: NextApiResponse) {
  let user = getAuth(req)
  let userDetails = req.body

  if (user === null) {
    return res.status(401).json("UNAUTHORISED_USER")
  }

  try {
    const alreadyExists = await prisma.user.findFirst({
      where: {
        id: user.userId as string,
      },
    })

    if (alreadyExists) {
      console.log(user)
      return res.status(200).json("USER_ALREADY_EXISTS")
    }

    await prisma.user.create({
      data: {
        id: user.userId as string,
        email: userDetails.email,
        password: userDetails.password,
      },
    })

    return res.status(201).json("SUCCESS")
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  let user = getAuth(req)

  if (user === null) {
    return res.status(401).json("UNAUTHORISED_USER")
  }
  const data = req.body

  try {
    await prisma.user.update({
      where: {
        id: user.userId as string,
      },
      data: data,
    })

    return res.status(200).json("USER UPDATED")
  } catch (err: any) {
    return res.status(400).json(err.message)
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      GET(req, res)
      break
    case "POST":
      POST(req, res)
      break
    case "PUT":
      PUT(req, res)
      break
  }
}
