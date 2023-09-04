import { bucket } from "./firebase-admin"

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
