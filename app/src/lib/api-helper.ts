import { toast } from "@/components/ui/use-toast"
import { NextApiResponse } from "next"
import axios, { AxiosError } from "axios"

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
