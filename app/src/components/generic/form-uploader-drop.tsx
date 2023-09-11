import { cn, humanFileSize } from "@/lib/utils"
import { ChangeEventHandler, useRef, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "../icons"
import Image from "next/image"

export const FileInfo: React.FC<{
  file: File
}> = ({ file }) => {
  let fileType: "other" | "pdf" | "image" = "other"

  if (file.type.includes("pdf")) fileType = "pdf"
  else if (file.type.includes("image")) fileType = "image"

  return (
    <div className="flex w-full flex-row gap-4">
      <div className="relative flex h-20 w-28 items-center justify-center rounded-lg bg-slate-100 dark:border dark:bg-card/30">
        {fileType === "pdf" && <Icons.fileIcon />}

        {fileType === "image" && (
          <Image
            src={URL.createObjectURL(file)}
            alt="Image"
            fill
            className="mx-auto max-w-[95%] rounded-lg object-contain"
          />
        )}

        {fileType === "other" && <Icons.fileTextIcon />}
      </div>

      <div className="flex grow flex-col gap-1">
        <p className="text-md font-bold">{file.name}</p>
        <p>{humanFileSize(file.size)}</p>
      </div>
    </div>
  )
}

export const FileUploaderDroppable: React.FC<{
  title: string
  multiple?: boolean
  description?: string
  className?: string
}> = ({ title, multiple = true, description = "", className = "" }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<FileList | null>()

  const onUploadClick = () => {
    inputRef.current?.click()
  }

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files

    if (!files) return

    console.log(files)
    setValue(files)
  }

  const onClear = () => {
    if (inputRef.current?.value) {
      inputRef.current.value = ""
      setValue(null)
    }
  }

  return (
    <Card className={cn("mx-auto max-w-screen-sm border", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed bg-slate-50 dark:bg-card/30">
          <Button variant="link" className="h-16" onClick={onUploadClick}>
            Drag and drop or Choose your files
          </Button>
        </div>

        <Input
          type="file"
          multiple={multiple}
          className="hidden"
          ref={inputRef}
          onChange={onChange}
        />

        <div className="mt-8 flex flex-col gap-4">
          {Array(value?.length ?? 0)
            .fill(0)
            .map((_, i) => {
              const file = value?.item(i)

              if (!file) return <></>

              return <FileInfo file={file} />
            })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClear}>
          Clear
        </Button>
      </CardFooter>
    </Card>
  )
}
