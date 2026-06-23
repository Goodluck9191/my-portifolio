"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, FileImage } from "lucide-react";

interface ImageDropzoneProps {
  onUpload: (url: string, alt: string) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageDropzone({ onUpload }: ImageDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const [altText, setAltText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only JPEG, PNG, WebP, and GIF files are allowed.";
    }
    if (file.size > MAX_SIZE) {
      return "File must be under 5MB.";
    }
    return null;
  }

  async function uploadFile(file: File) {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const name = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    setPreview({ url: objectUrl, name });
    setAltText(name);
    setError("");

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      const result = await new Promise<{ url: string }>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error ?? "Upload failed"));
            } catch {
              reject(new Error("Upload failed"));
            }
          }
        });
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("POST", "/api/upload");
        xhr.withCredentials = true;
        xhr.send(formData);
      });

      const alt = altText || name;
      onUpload(result.url, alt);
      setPreview(null);
      setAltText("");
      setProgress(0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [altText]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function cancelPreview() {
    setPreview(null);
    setAltText("");
    setError("");
  }

  function confirmPreview() {
    if (preview) {
      onUpload(preview.url, altText || preview.name);
      setPreview(null);
      setAltText("");
    }
  }

  if (preview) {
    return (
      <div className="rounded-lg border border-[#22223A] bg-[#0F0F1A] p-4">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#16162A]">
            <img src={preview.url} alt="Preview" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="font-sans text-xs text-[#7A7A9A]">{preview.name}</p>
            {uploading ? (
              <div className="space-y-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#22223A]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="font-sans text-xs text-[#7A7A9A]">Uploading... {progress}%</p>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Alt text (for SEO)"
                  className="w-full rounded border border-[#22223A] bg-[#16162A] px-2 py-1 font-sans text-xs text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={confirmPreview}
                    className="rounded bg-[#6C63FF] px-3 py-1 font-sans text-xs text-white hover:bg-[#5A52E0]"
                  >
                    Insert
                  </button>
                  <button
                    onClick={cancelPreview}
                    className="rounded bg-[#22223A] px-3 py-1 font-sans text-xs text-[#7A7A9A] hover:text-[#EEEEFF]"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {error && <p className="mt-2 font-sans text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div
      ref={dropRef}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 transition-all ${
        dragOver
          ? "border-[#6C63FF] bg-[#6C63FF]/10"
          : "border-[#22223A] bg-[#16162A] hover:border-[#6C63FF]"
      }`}
    >
      {uploading ? (
        <>
          <Loader2 size={16} className="animate-spin text-[#6C63FF]" />
          <span className="font-sans text-sm text-[#7A7A9A]">Uploading... {progress}%</span>
        </>
      ) : (
        <>
          <FileImage size={16} className="text-[#7A7A9A]" />
          <span className="font-sans text-sm text-[#7A7A9A]">
            {dragOver ? "Drop image here" : "Drag & drop or click to upload"}
          </span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
