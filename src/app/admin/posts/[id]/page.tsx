"use client";

import { useState, useEffect, use, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "../../layout";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { slugify } from "@/lib/utils";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  image_url: "",
  meta_description: "",
  read_time: 5,
  published: false,
  featured: false,
  tags: "",
};

export default function PostFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";
  const { token } = useAdmin();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const autoReadTime = useMemo(() => {
    const words = form.content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }, [form.content]);

  useEffect(() => {
    if (isNew) return;
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Not found");
        const { data } = await res.json();
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          category: data.category ?? "",
          image_url: data.image_url ?? "",
          meta_description: data.meta_description ?? "",
          read_time: data.read_time ?? 5,
          published: data.published ?? false,
          featured: data.featured ?? false,
          tags: (data.tags ?? []).join(", "),
        });
      } catch {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, isNew]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target;
      const name = target.name;
      const value =
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.type === "number"
            ? Number(target.value)
            : target.value;

      setForm((prev) => {
        const next = { ...prev, [name]: value };
        if (name === "title" && !slugManuallyEdited && isNew) {
          next.slug = slugify(String(value));
        }
        return next;
      });
    },
    [slugManuallyEdited, isNew]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      read_time: autoReadTime,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(
        isNew ? "/api/posts" : `/api/posts/${id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        const details = errData.issues?.length
          ? errData.issues.map((i: { path: (string | number)[]; message: string }) =>
              `${i.path.join(".")}: ${i.message}`
            ).join("; ")
          : "";
        throw new Error(details ? `${errData.error}: ${details}` : errData.error ?? "Failed to save");
      }

      toast.success(isNew ? "Post created" : "Post saved");
      router.push("/admin/posts");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6C63FF] border-t-transparent" />
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-[#2A2A38] bg-[#16162A] px-4 py-3 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF]";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">
          {isNew ? "New Post" : "Edit Post"}
        </h1>
        {!isNew && form.slug && (
          <a
            href={`/blog/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[#2A2A38] px-3 py-2 font-sans text-sm text-[#00D4FF] transition-colors hover:bg-[#00D4FF]/10"
          >
            <ExternalLink size={14} />
            Preview
          </a>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className={inputClass} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">Slug *</label>
          <input
            name="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugManuallyEdited(true);
              handleChange(e);
            }}
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">Category *</label>
          <input name="category" value={form.category} onChange={handleChange} className={inputClass} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">Excerpt *</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
            rows={2}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">
            Meta Description
            <span className="ml-1 font-mono text-[10px] text-[#7A7A9A]">
              ({form.meta_description.length}/160
              {form.meta_description.length > 160 && (
                <span className="text-red-500"> - exceeds limit!</span>
              )}
              {form.meta_description.length > 0 && form.meta_description.length < 50 && (
                <span className="text-yellow-500"> - minimum 50 chars</span>
              )}
            </span>
          </label>
          <textarea
            name="meta_description"
            value={form.meta_description}
            onChange={handleChange}
            className={`${inputClass} resize-none ${form.meta_description.length > 160 ? "border-red-500 focus:border-red-500" : ""}`}
            rows={3}
            maxLength={200}
          />
          <p className="font-sans text-[11px] text-[#7A7A9A]">
            Meta description appears in Google search results and helps improve SEO.
          </p>
          {form.meta_description && (
            <div className="mt-1 rounded-lg border border-[#2A2A38] bg-[#1A1A2E] p-3">
              <p className="font-sans text-[11px] text-[#00D4FF]">Search result preview:</p>
              <p className="mt-1 font-sans text-[13px] text-[#1558a8] line-clamp-2">
                {form.title || "Post Title"}
              </p>
              <p className="font-sans text-[12px] text-[#006621] line-clamp-1">
                https://yourdomain.com/blog/{form.slug || "post-slug"}
              </p>
              <p className="font-sans text-[13px] text-[#545454] line-clamp-2">
                {form.meta_description.slice(0, 160)}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">Content *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
            rows={12}
            required
          />
        </div>

        <ImageUpload
          value={form.image_url}
          onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
          label="Cover Image"
        />
        <input name="image_url" value={form.image_url} onChange={handleChange} className="hidden" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-[#7A7A9A]">Read Time (minutes)</label>
            <div className="flex items-center gap-2">
              <input
                name="read_time"
                type="number"
                value={form.read_time}
                onChange={handleChange}
                className={inputClass}
                min={1}
              />
              <span className="shrink-0 font-mono text-[11px] text-[#7A7A9A]">
                Auto: {autoReadTime}m
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">
            Tags (comma-separated)
          </label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className={inputClass}
            placeholder="TypeScript, React, Architecture"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="h-4 w-4 rounded border-[#2A2A38] bg-[#16162A] text-[#6C63FF]"
            />
            <span className="font-sans text-sm text-[#EEEEFF]">Published</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-[#2A2A38] bg-[#16162A] text-[#6C63FF]"
            />
            <span className="font-sans text-sm text-[#EEEEFF]">Featured</span>
          </label>
        </div>

        {error && <p className="font-sans text-sm text-red-500">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving..." : isNew ? "Create Post" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className="rounded-lg border border-[#22223A] px-6 py-3 font-sans text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
