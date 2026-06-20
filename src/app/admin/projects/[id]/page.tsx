"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "../../layout";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { slugify } from "@/lib/utils";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  long_description: "",
  category: "",
  image_url: "",
  demo_url: "",
  github_url: "",
  case_study_url: "",
  tech_stack: "",
  featured: false,
  status: "completed" as const,
  client_name: "",
  duration: "",
  role: "",
  results: "",
};

export default function ProjectFormPage({
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

  useEffect(() => {
    if (isNew) return;
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Not found");
        const { data } = await res.json();
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          description: data.description ?? "",
          long_description: data.long_description ?? "",
          category: data.category ?? "",
          image_url: data.image_url ?? "",
          demo_url: data.demo_url ?? "",
          github_url: data.github_url ?? "",
          case_study_url: data.case_study_url ?? "",
          tech_stack: (data.tech_stack ?? []).join(", "),
          featured: data.featured ?? false,
          status: data.status ?? "completed",
          client_name: data.client_name ?? "",
          duration: data.duration ?? "",
          role: data.role ?? "",
          results: data.results ?? "",
        });
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
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
      tech_stack: form.tech_stack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(
        isNew ? "/api/projects" : `/api/projects/${id}`,
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
          ? errData.issues.map((i: { path: (string | number)[]; message: string }) => `${i.path.join(".")}: ${i.message}`).join("; ")
          : "";
        throw new Error(details ? `${errData.error}: ${details}` : errData.error ?? "Failed to save");
      }

      toast.success(isNew ? "Project created" : "Project saved");
      router.push("/admin/projects");
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
          {isNew ? "New Project" : "Edit Project"}
        </h1>
        {!isNew && form.slug && (
          <a
            href={`/projects/${form.slug}`}
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
          <label className="font-sans text-xs text-[#7A7A9A]">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
            rows={3}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">Long Description</label>
          <textarea
            name="long_description"
            value={form.long_description}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
            rows={5}
          />
        </div>

        <ImageUpload
          value={form.image_url}
          onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
          label="Image"
        />
        <input name="image_url" value={form.image_url} onChange={handleChange} className="hidden" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-[#7A7A9A]">Demo URL</label>
            <input name="demo_url" value={form.demo_url} onChange={handleChange} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-[#7A7A9A]">GitHub URL</label>
            <input name="github_url" value={form.github_url} onChange={handleChange} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-[#7A7A9A]">Case Study URL</label>
            <input name="case_study_url" value={form.case_study_url} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">
            Tech Stack (comma-separated)
          </label>
          <input
            name="tech_stack"
            value={form.tech_stack}
            onChange={handleChange}
            className={inputClass}
            placeholder="Next.js, TypeScript, PostgreSQL"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-[#7A7A9A]">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-[#7A7A9A]">Client Name</label>
            <input name="client_name" value={form.client_name} onChange={handleChange} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-[#7A7A9A]">Duration</label>
            <input name="duration" value={form.duration} onChange={handleChange} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-[#7A7A9A]">Role</label>
            <input name="role" value={form.role} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">Results</label>
          <input name="results" value={form.results} onChange={handleChange} className={inputClass} />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-[#2A2A38] bg-[#16162A] text-[#6C63FF]"
          />
          <span className="font-sans text-sm text-[#EEEEFF]">Featured project</span>
        </label>

        {error && <p className="font-sans text-sm text-red-500">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving..." : isNew ? "Create Project" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
            className="rounded-lg border border-[#22223A] px-6 py-3 font-sans text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
