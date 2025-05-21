"use client";

import React from "react";

interface Props {
  onFileUpload: (file: ArrayBuffer) => void;
}

export default function PDFUploader({ onFileUpload }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          onFileUpload(reader.result);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-blue-500 p-8 rounded-md text-center mb-6">
      <p className="mb-4">📂 Drag and drop or select a PDF pitch deck</p>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
    </div>
  );
}
