"use client";

import { useState } from "react";
import "./quote-poc.css";
import QuoteColumn from "./quote-column";

const QuotePocPage = () => {
  const [veil, setVeil] = useState(0.05);

  return (
    <main className="poc-screen bg-white text-gray-600">
      <div className="mx-auto flex w-fit gap-16 px-8 pt-10">
        <QuoteColumn label="Couvercle" variant="lid" veil={veil} />
        <QuoteColumn label="Cadrage" variant="crop" veil={veil} />
      </div>

      <div className="h-[40vh]" />

      <div className="fixed inset-x-0 bottom-0 border-black/15 border-t bg-white px-4 py-3 text-[12px]">
        <label className="mx-auto flex max-w-4xl items-center justify-center gap-3">
          <span className="tabular-nums text-black/45">voile {veil}</span>
          <input
            type="range"
            min={0.01}
            max={0.4}
            step={0.01}
            value={veil}
            onChange={(event) => setVeil(Number(event.target.value))}
            className="w-48"
          />
        </label>
      </div>
    </main>
  );
};

export default QuotePocPage;
