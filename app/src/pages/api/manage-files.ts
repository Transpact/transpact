import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"
import { handleError, handleResponse } from "@/lib/api-helper"
// async function POST(req: NextApiRequest, res: NextApiResponse){

//   const formData = await req.formData();

//   console.log(formData);

//   const p_apiKey = env.PINATA_API_KEY;
//   const p_secret = env.PINATA_API_SECRET;



//   // console.log(resp,"=====");


//   return handleResponse({
//     res,
//     data: {},
//     statusCode: 201,
//     message: "Image Saved",
//   })
  
// }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
      case "GET":
        return handleError({
          res,
          data: {},
          statusCode: 200,
          message: "Test",
        })
      // case "POST":
      //   return POST(req, res)
      // case "PUT":
      //   return PUT(req, res)
      default:
        return handleError({
          res,
          data: {},
          statusCode: 404,
          message: "Only GET POST and PUT allowed",
        })
    }
  }
  