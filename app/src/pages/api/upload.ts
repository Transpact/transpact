import { handleError, handleResponse } from "@/lib/api-helper"
import { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"
import { uploadObjectToIPFS } from "@/lib/storage"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = formidable({
      allowEmptyFiles: false,
      keepExtensions: true,
      maxFileSize: 1024 * 1024 * 10,
    })

    const [fields, files] = await form.parse(req)
    const file = files.file

    if (!file || file.length === 0) {
      return handleError({
        res,
        statusCode: 400,
        data: {},
        message: "Image is required",
      })
    }

    const url = await uploadObjectToIPFS({
      fileName: file[0].originalFilename ?? file[0].newFilename,
      filePath: file[0].filepath,
    })

    return handleResponse({
      res,
      data: { url },
      message: "Image uploaded to IPFS",
    })
  } catch (e: any) {
    return handleError({
      res,
      statusCode: 400,
      data: {},
      message: e?.message ?? "Failed to upload image",
    })
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return POST(req, res)
    default:
      return handleError({
        res,
        statusCode: 404,
        data: {},
        message: "Only POST allowed",
      })
  }
}
