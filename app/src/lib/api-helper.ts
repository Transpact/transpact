import { toast } from "@/components/ui/use-toast"
import { NextApiResponse } from "next"
import axios, { AxiosError } from "axios"
import { ENDPOINTS } from "./constants"

export const server = axios.create({})

export const handleResponse = ({
  res,
  statusCode = 200,
  data,
  message,
}: {
  res: NextApiResponse
  statusCode?: number
  data: any
  message: string
}) => {
  return res.status(statusCode).json({
    data,
    message,
  })
}

export const handleError = ({
  res,
  statusCode,
  data,
  message,
}: {
  res: NextApiResponse
  statusCode: number
  data: any
  message: string
}) => {
  return res.status(statusCode).json({
    data,
    message,
  })
}

export const showAxiosError = ({
  error,
  generic = "Error getting data",
  additionalText,
}: {
  error: AxiosError
  generic: string
  additionalText?: string
}) => {
  const errMsg = (error.response?.data as APIResponse).message ?? generic

  toast({
    variant: "destructive",
    title: errMsg,
    description: additionalText,
  })
}


export async function uploadFile(file:File) {

  const formData = new FormData();
  
  
  formData.append('file',file);
  
  let resp = await server.post(
    ENDPOINTS.uploadFile,
    formData,
    {
      headers: {
          "Content-Type": "multipart/form-data"
      },
    }
  )
  
  return resp.data.data.url as string
}