"use client"
import QuestionFileInput from "@/components/QuestionFileInput";

export default function Home() {
  return (
    <main className="flex-center min-h-screen flex-col p-28 bg-slate-300">
      <div className="flex items-center justify-evenly min-h-[40vh] flex-col gap-y-16 bg-white px-28 py-16 rounded-lg shadow-lg">
        <h1 className="text-5xl font-semibold">Quiz App</h1>
        <QuestionFileInput />
      </div>
    </main>
  );
}
