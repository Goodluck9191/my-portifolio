"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdmin } from "../layout";
import type { Project } from "@/lib/types";

export default function AdminProjectsPage() {
  const { token } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.data ?? []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete project:", err);
    } finally {
      setDeleting(null);
    }
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
          <h1 className="font-display text-2xl font-bold text-white">Projects</h1>
          <p className="font-sans text-sm text-[#7A7A9A]">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-4 py-2 font-sans text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
        >
          <Plus size={16} />
          New Project
        </Link>
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
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-[#22223A] transition-colors hover:bg-[#0F0F1A]/50"
              >
                <td className="px-4 py-3 font-sans text-sm text-[#EEEEFF]">
                  {project.title}
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
                  {project.featured ? (
                    <span className="font-mono text-xs text-[#6C63FF]">Yes</span>
                  ) : (
                    <span className="font-mono text-xs text-[#7A7A9A]">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting === project.id}
                      className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center font-sans text-sm text-[#7A7A9A]"
                >
                  No projects yet. Create your first project.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
