import { bucket } from "./firebase-admin"
import pinataSdk from "@pinata/sdk"
import { env } from "@/env.mjs"
import { createReadStream } from "fs"

export const uploadObjectToFirebase = async (
  localFilePath: string,
  firebasePath: string
) => {
  const [file] = await bucket.upload(localFilePath, {
    destination: firebasePath,
    public: true,
  })

  return file.publicUrl
}

export const uploadObjectToIPFS = async ({
  filePath,
  fileName,
}: {
  filePath: string
  fileName: string
}) => {
  const pinata = new pinataSdk(
    env.NEXT_PUBLIC_PINATA_API_KEY,
    env.NEXT_PUBLIC_PINATA_API_SECRET
  )

  const fileStream = createReadStream(filePath)

  const { IpfsHash } = await pinata.pinFileToIPFS(fileStream, {
    pinataMetadata: {
      name: fileName,
    },
  })

  const url = `https://ipfs.io/ipfs/${IpfsHash}`

  return url
}
