import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"
import { handleError, handleResponse } from "@/lib/api-helper"

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
    const alreadyExists = await prisma.user.findFirst({
      where: {
        id: user.userId as string,
      },
    })

    if (!alreadyExists) {
      return handleError({
        res,
        statusCode: 400,
        data: {
          user_completed: false,
        },
        message: "The user does not exists",
      })
    }

    return handleResponse({
      res,
      message: "",
      data: {
        user_completed: alreadyExists.user_completed,
        user_type: alreadyExists.user_type
      },
    })
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  
  let user = getAuth(req)
  let userDetails = req.body

  if (user === null) {
    return handleError({
      res,
      statusCode: 401,
      data: {},
      message: "You are not authorised",
    })
  }

  try {
    const alreadyExists = await prisma.user.findFirst({
      where: {
        id: user.userId as string,
      },
    })

    if (alreadyExists) {
      return handleError({
        res,
        statusCode: 200,
        data: {},
        message: "User already exists",
      })
    }

    await prisma.user.create({
      data: {
        id: user.userId as string,
        email: userDetails.email,
        password: userDetails.password,
      },
    })

    return handleResponse({
      res,
      statusCode: 201,
      data: {},
      message: "Success",
    })
  } catch (error: any) {
    return handleError({
      res,
      statusCode: 401,
      data: {},
      message: error?.message ?? "Failed to create user",
    })
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  let user = getAuth(req)

  if (user === null) {
    return handleError({
      res,
      statusCode: 401,
      data: {},
      message: "You are not authorised",
    })
  }

  const data = req.body

  try {
    await prisma.user.update({
      where: {
        id: user.userId as string,
      },
      data: data,
    })

    return handleResponse({
      res,
      statusCode: 200,
      data: {},
      message: "Successfully updated the user",
    })
  } catch (error: any) {
    return handleError({
      res,
      statusCode: 401,
      data: {},
      message: error?.message ?? "Failed to update user",
    })
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return GET(req, res)
    case "POST":
      return POST(req, res)
    case "PUT":
      return PUT(req, res)
    default:
      return handleError({
        res,
        data: {},
        statusCode: 404,
        message: "Only GET POST and PUT allowed",
      })
  }
}
