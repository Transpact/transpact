import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export const DocumentViewer: React.FC<{
  documentUrl: string
}> = ({ documentUrl }) => {
  const [numPages, setNumPages] = useState(0)
  const [error, setError] = useState<boolean>(false)

  return (
    <div className="h-min--24 mx-auto max-h-[720px] max-w-screen-md overflow-scroll rounded-lg border border-gray-400 p-4">
      {error && (
        <p>
          Error loading data, view <Link href={documentUrl}>here</Link>
        </p>
      )}

      <Document
        file={documentUrl}
        onError={(e, args) => {
          setError(true)
        }}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
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
