"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
  file: ArrayBuffer;
}

export default function PDFViewer({ file }: Props) {
  return (
    <div className="mt-8">
      <Document file={{ data: file }}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}
