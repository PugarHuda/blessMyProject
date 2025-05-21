"use client";

import { useState } from "react";
import { FaRedoAlt } from "react-icons/fa";

export default function ReviewPage() {
  const [activeSlide, setActiveSlide] = useState(1);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const slides = [
    { id: 1, label: "Slide 1", content: "Content of Slide 1" },
    { id: 2, label: "Slide 2", content: "Content of Slide 2" },
    { id: 3, label: "Slide 3", content: "Content of Slide 3" },
  ];

  async function getAIReview() {
    setLoading(true);
    setAiFeedback(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: slides[activeSlide - 1].content }),
      });

      const data = await res.json();

      if (res.ok) {
        setAiFeedback(data.feedback);
      } else {
        setAiFeedback(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setAiFeedback(`Error: ${error.message}`);
    }

    setLoading(false);
  }

  return (
    <main className="bg-white text-gray-900 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-[#F9FAFC] rounded-md p-10 shadow-md">
        <header className="flex justify-between items-center mb-8">
          <a
            href="#"
            className="text-blue-600 font-semibold text-xl hover:underline"
          >
            Bless My Pitch
          </a>
          <button
            aria-label="Reload"
            className="text-gray-700 hover:text-gray-900"
            onClick={getAIReview}
            disabled={loading}
          >
            <FaRedoAlt className="text-lg" />
          </button>
        </header>

        <h2 className="text-4xl font-extrabold text-[#0B1C3F] mb-4 leading-tight">
          Upload your pitch.
          <br />
          Let AI review it.
        </h2>

        <p className="text-lg text-[#0B1C3F] mb-10 max-w-xl">
          Upload a PDF pitch deck and get AI powered feedback instantly.
        </p>

        <div className="flex border border-[#E6E9F0] rounded-md overflow-hidden mb-8">
          <div className="w-1/3 bg-[#F9FAFC] border-r border-[#E6E9F0] p-6 flex flex-col items-center space-y-6">
            <img
              src="https://storage.googleapis.com/a1aa/image/c77629da-95b5-4542-3aa6-2bb3845ba456.jpg"
              alt="Slide preview"
              className="w-full rounded-md"
            />
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() => {
                  setActiveSlide(slide.id);
                  setAiFeedback(null);
                }}
                className={`w-full text-base py-3 px-4 rounded-md ${
                  activeSlide === slide.id
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-[#0B1C3F] text-left hover:text-blue-600"
                }`}
              >
                {slide.label}
              </button>
            ))}
          </div>

          <div className="w-2/3 p-8">
            <h3 className="text-[#0B1C3F] font-semibold mb-5 text-xl">
              AI Feedback
            </h3>
            {loading ? (
              <p>Loading AI feedback...</p>
            ) : aiFeedback ? (
              <p className="whitespace-pre-wrap text-[#0B1C3F]">{aiFeedback}</p>
            ) : (
              <ul className="list-disc list-inside text-base text-[#0B1C3F] space-y-3 leading-relaxed">
                <li>The content on this slide is not clearly communicable.</li>
                <li>Consider adding a supporting image or video slides.</li>
                <li>Use a more engaging and informative tone.</li>
              </ul>
            )}
          </div>
        </div>

        <div className="border border-[#E6E9F0] rounded-md p-6 flex items-center space-x-6">
          <div
            aria-label="Score 78"
            className="bg-[#3B9E7E] text-white font-semibold text-2xl rounded-md w-16 h-16 flex items-center justify-center"
          >
            78
          </div>
          <div className="text-[#0B1C3F] text-lg leading-relaxed">
            <p className="font-semibold mb-2 text-xl">Final Score</p>
            <p>Overall, a solid pitch with room for improvement.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
