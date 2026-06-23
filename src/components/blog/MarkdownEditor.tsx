"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { MDEditorProps } from "@uiw/react-md-editor";
import ImageDropzone from "./ImageDropzone";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [ready, setReady] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  const handleInsertImage = useCallback((url: string, alt: string) => {
    const markdown = `![${alt}](${url})`;
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newValue = value.slice(0, start) + markdown + value.slice(end);
      onChange(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + markdown.length;
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      onChange(value + "\n" + markdown + "\n");
    }
  }, [value, onChange]);

  if (!ready) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        className="w-full rounded-lg border border-[#2A2A38] bg-[#16162A] px-4 py-3 font-mono text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF]"
        placeholder="Write your article content here..."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3" data-color-mode="dark">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? "")}
        height={500}
        preview="live"
        visibleDragbar={false}
      />
      <ImageDropzone onUpload={handleInsertImage} />
    </div>
  );
}
