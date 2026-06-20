"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import * as Lucide from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "../layout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Project } from "@/lib/types";

const ITEMS_PER_PAGE = 10;

export default function AdminProjectsPage() {
  const { token } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects(data.data ?? []);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !search || p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || p.category === filterCategory;
      const matchesStatus =
        filterStatus === "All" || p.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, search, filterCategory, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  }, [deleteTarget, token]);

  const toggleFeatured = useCallback(async (project: Project) => {
    setToggling(project.id);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !project.featured }),
      });
      if (!res.ok) throw new Error();
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, featured: !p.featured } : p
        )
      );
      toast.success(project.featured ? "Unfeatured" : "Featured");
    } catch {
      toast.error("Failed to update");
    } finally {
      setToggling(null);
    }
  }, [token]);

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
          <h1 className="font-display text-2xl font-bold text-white">Projects</h1>
          <p className="font-sans text-sm text-[#7A7A9A]">
            {filtered.length} of {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-4 py-2 font-sans text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
        >
          <Lucide.Plus size={16} />
          New Project
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Lucide.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A9A]" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-[#2A2A38] bg-[#0F0F1A] py-2 pl-10 pr-4 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF]"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
          className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] px-3 py-2 font-sans text-sm text-[#EEEEFF] outline-none focus:border-[#6C63FF]"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] px-3 py-2 font-sans text-sm text-[#EEEEFF] outline-none focus:border-[#6C63FF]"
        >
          <option value="All">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#2A2A38]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A2A38] bg-[#0F0F1A]">
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Title</th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Category</th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Status</th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Featured</th>
              <th className="px-4 py-3 text-right font-mono text-xs font-medium text-[#7A7A9A]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((project) => (
              <tr
                key={project.id}
                className="border-b border-[#22223A] transition-colors hover:bg-[#0F0F1A]/50"
              >
                <td className="px-4 py-3 font-sans text-sm text-[#EEEEFF]">
                  <Link href={`/admin/projects/${project.id}`} className="hover:text-[#6C63FF] transition-colors">
                    {project.title}
                  </Link>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-[#7A7A9A]">
                  {project.category}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                      project.status === "completed"
                        ? "bg-green-500/10 text-green-500"
                        : project.status === "in-progress"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleFeatured(project)}
                    disabled={toggling === project.id}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium transition-colors disabled:opacity-40 ${
                      project.featured
                        ? "bg-[#6C63FF]/10 text-[#6C63FF] hover:bg-[#6C63FF]/20"
                        : "bg-[#2A2A38]/50 text-[#7A7A9A] hover:bg-[#2A2A38]"
                    }`}
                  >
                    {project.featured ? "★ On" : "☆ Off"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {project.slug && (
                      <a
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#00D4FF]"
                        title="Preview"
                      >
                        <Lucide.ExternalLink size={16} />
                      </a>
                    )}
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
                    >
                      <Lucide.Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(project)}
                      disabled={deleting === project.id}
                      className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                    >
                      <Lucide.Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center font-sans text-sm text-[#7A7A9A]">
                  {search || filterCategory !== "All" || filterStatus !== "All"
                    ? "No projects match your filters."
                    : "No projects yet. Create your first project."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-[#2A2A38] px-3 py-1.5 font-sans text-sm text-[#EEEEFF] transition-colors hover:bg-[#1A1A2E] disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-lg px-3 py-1.5 font-sans text-sm transition-colors ${
                p === page
                  ? "bg-[#6C63FF] text-white"
                  : "border border-[#2A2A38] text-[#EEEEFF] hover:bg-[#1A1A2E]"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-[#2A2A38] px-3 py-1.5 font-sans text-sm text-[#EEEEFF] transition-colors hover:bg-[#1A1A2E] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel={deleting === deleteTarget?.id ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
