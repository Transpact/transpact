import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export const DocumentViewer: React.FC<{
  documentUrl: string
  className?: string
}> = ({ documentUrl, className = "" }) => {
  const [numPages, setNumPages] = useState(0)
  const [error, setError] = useState<string | null>(null)

  return (
    <div
      className={cn(
        "h-min--24 mx-auto max-h-[720px] max-w-screen-md overflow-scroll rounded-lg border border-gray-400 p-4",
        className
      )}
    >
      <Document
        file={documentUrl}
        onError={(e, args) => {
          setError("Failed to load PDF")
        }}
        onLoadError={(error) => {
          setError(error?.message ?? "Failed to load PDF")
        }}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages)
          setError(null)
        }}
        error={() => (
          <p>
            {error}, view the file{" "}
            <Link href={documentUrl} className="underline" target="_blank">
              here
            </Link>
            .
          </p>
        )}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        ))}
      </Document>
    </div>
  )
}

const DocumentViewerDynamic = dynamic(
  () =>
    import("@/components/generic/doc-viewer").then((com) => com.DocumentViewer),
  {
    ssr: false,
  }
)
