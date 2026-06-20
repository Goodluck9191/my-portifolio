"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Upload, Trash2, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "../layout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface MediaFile {
  name: string;
  url: string;
  created_at: string;
  size: number;
}

export default function AdminMediaPage() {
  const { token } = useAdmin();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchFiles() {
    try {
      const res = await fetch("/api/upload", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const { data } = await res.json();
        setFiles(data ?? []);
      }
    } catch {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, [token]);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Upload failed");
        }
        toast.success("File uploaded");
        fetchFiles();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [token]
  );

  const copyUrl = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      toast.success("URL copied");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ path: `uploads/${deleteTarget.name}` }),
      });
      if (!res.ok) throw new Error();
      setFiles((prev) => prev.filter((f) => f.name !== deleteTarget.name));
      toast.success("File deleted");
    } catch {
      toast.error("Failed to delete file");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, token]);

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6C63FF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Media</h1>
          <p className="font-sans text-sm text-[#7A7A9A]">
            {files.length} file{files.length !== 1 ? "s" : ""}
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-4 py-2 font-sans text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40">
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? "Uploading..." : "Upload"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {files.length === 0 ? (
        <div className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-12 text-center">
          <Upload size={40} className="mx-auto mb-3 text-[#7A7A9A]" />
          <p className="font-sans text-sm text-[#7A7A9A]">
            No media files yet. Upload your first image.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {files.map((file) => (
            <div
              key={file.name}
              className="group relative overflow-hidden rounded-lg border border-[#2A2A38] bg-[#0F0F1A]"
            >
              <div className="relative aspect-square">
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(file.url)}
                    className="rounded-lg bg-[#6C63FF] p-2 text-white transition-colors hover:bg-[#5A52E0]"
                    title="Copy URL"
                  >
                    {copied === file.url ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(file)}
                    className="rounded-lg bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="border-t border-[#2A2A38] px-3 py-2">
                <p className="truncate font-mono text-xs text-[#EEEEFF]">
                  {file.name}
                </p>
                <p className="font-mono text-[10px] text-[#7A7A9A]">
                  {formatSize(file.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete File"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
