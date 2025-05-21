"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleStartReview = async () => {
    if (!selectedFile) {
      alert("Please upload a PDF file first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Failed to get feedback: " + err.error);
        setLoading(false);
        return;
      }

      const data = await res.json();

      localStorage.setItem("reviewFeedback", JSON.stringify(data.feedback));

      setLoading(false);

      router.push("/review");
    } catch (error) {
      alert("Error: " + (error as Error).message);
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#fafafa] min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-md p-12 shadow-sm w-full max-w-3xl font-inter">
        <a
          href="#"
          className="text-blue-600 font-semibold text-2xl mb-8 inline-block"
        >
          Bless My Pitch
        </a>
        <h1 className="text-[#0a1f44] font-extrabold text-5xl leading-tight mb-6">
          Upload your pitch.
          <br />
          Let AI review it.
        </h1>
        <p className="text-[#0a1f44] text-lg font-normal mb-12 max-w-2xl">
          Upload a PDF pitch deck and get AI
          <br />
          -powered feedback instantly.
        </p>

        <div
          className="flex flex-col items-center justify-center border border-dashed border-[#cbd5e1] rounded-md cursor-pointer py-16 mb-12 text-[#0a1f44] text-lg font-normal max-w-2xl mx-auto text-center"
          onClick={handleUploadClick}
        >
          <FaCloudUploadAlt className="text-4xl mb-4" />
          {selectedFile ? (
            <>
              <span className="text-green-600 font-semibold">
                ✅ {selectedFile.name}
              </span>
              <span className="text-sm text-gray-500 mt-2">
                Click to replace
              </span>
            </>
          ) : (
            <>
              <span>
                Drop a PDF pitch <span className="font-semibold">file</span>{" "}
                here,
                <br />
                or{" "}
                <span className="text-blue-600 font-normal cursor-pointer">
                  browse files
                </span>
              </span>
            </>
          )}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
          />
        </div>

        <button
          type="button"
          onClick={handleStartReview}
          disabled={loading}
          className={`bg-blue-600 text-white font-semibold text-lg rounded-md py-4 px-12 w-full max-w-2xl mx-auto block mb-6
            hover:bg-blue-700
            cursor-pointer
            transition-colors duration-300
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {loading ? "Analyzing..." : "Start Review"}
        </button>

        <p className="text-[#0a1f44] text-base text-center max-w-2xl mx-auto">
          Check out an{" "}
          <a href="#" className="text-blue-600">
            example pitch
          </a>
        </p>
      </div>
    </main>
  );
}
