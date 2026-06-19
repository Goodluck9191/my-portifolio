"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  theme: "dark",
  themeVariables: {
    primaryColor: "#1A1A2E",
    primaryTextColor: "#EEEEFF",
    primaryBorderColor: "#6C63FF",
    lineColor: "#2A2A38",
    secondaryColor: "#16162A",
    tertiaryColor: "#0F0F1A",
    fontFamily: "Inter, sans-serif",
  },
  securityLevel: "loose",
});

interface MermaidDiagramProps {
  chart: string;
  caption?: string;
}

export function MermaidDiagram({ chart, caption }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    idRef.current += 1;
    const id = `mermaid-${idRef.current}`;

    mermaid.render(id, chart).then(({ svg }) => {
      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
        setRendered(true);
      }
    });
  }, [chart]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-6">
      <div ref={containerRef} className="flex w-full justify-center overflow-x-auto [&_svg]:max-w-full" />
      {!rendered && (
        <p className="font-sans text-sm text-[#7A7A9A]">Loading diagram...</p>
      )}
      {caption && (
        <p className="font-sans text-sm text-[#7A7A9A]">{caption}</p>
      )}
    </div>
  );
}
