"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Plus,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useAdmin } from "./layout";
import type { Project, Post, Contact } from "@/lib/types";

type ActivityItem = {
  type: "project" | "post" | "contact";
  label: string;
  detail: string;
  href: string;
  date: string;
};

export default function AdminDashboard() {
  const { token } = useAdmin();
  const router = useRouter();
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    unreadContacts: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [projectsRes, postsRes, contactsRes] = await Promise.all([
          fetch("/api/projects", { headers }),
          fetch("/api/posts", { headers }),
          fetch("/api/contact", { headers }),
        ]);

        const projects: { data: Project[] } = await projectsRes.json();
        const posts: { data: Post[] } = await postsRes.json();
        const contacts: { data: Contact[] } = await contactsRes.json();

        const projectsData = projects.data ?? [];
        const postsData = posts.data ?? [];
        const contactsData = contacts.data ?? [];

        setStats({
          projects: projectsData.length,
          posts: postsData.length,
          unreadContacts: contactsData.filter((c) => c.status === "unread").length,
        });

        // Build combined recent activity feed (last 5 items across all types)
        const activity: ActivityItem[] = [
          ...projectsData.slice(0, 5).map((p) => ({
            type: "project" as const,
            label: p.title,
            detail: p.category,
            href: `/admin/projects/${p.id}`,
            date: p.created_at,
          })),
          ...postsData.slice(0, 5).map((p) => ({
            type: "post" as const,
            label: p.title,
            detail: p.published ? "Published" : "Draft",
            href: `/admin/posts/${p.id}`,
            date: p.created_at,
          })),
          ...contactsData.slice(0, 5).map((c) => ({
            type: "contact" as const,
            label: c.name,
            detail: c.email,
            href: `/admin/contacts`,
            date: c.created_at,
          })),
        ];

        activity.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentActivity(activity.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [token]);

  const statCards = [
    {
      icon: FolderKanban,
      label: "Projects",
      value: stats.projects,
      href: "/admin/projects",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: FileText,
      label: "Posts",
      value: stats.posts,
      href: "/admin/posts",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: MessageSquare,
      label: "Unread Messages",
      value: stats.unreadContacts,
      href: "/admin/contacts",
      color: "from-green-500/20 to-emerald-500/20",
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: "Add New Project",
      onClick: () => router.push("/admin/projects/new"),
      color: "from-[#6C63FF] to-[#00D4FF]",
    },
    {
      icon: FileText,
      label: "Write New Post",
      onClick: () => router.push("/admin/posts/new"),
      color: "from-[#6C63FF] to-[#00D4FF]",
    },
    {
      icon: Mail,
      label: "View Messages",
      onClick: () => router.push("/admin/contacts"),
      color: "from-[#6C63FF] to-[#00D4FF]",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6C63FF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="font-sans text-sm text-[#7A7A9A]">
          Overview of your portfolio content.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ icon: Icon, label, value, href, color }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-5 transition-all duration-200 hover:border-[#6C63FF]"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${color}`}
              >
                <Icon size={22} className="text-[#EEEEFF]" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-white">
                  {value}
                </p>
                <p className="font-sans text-sm text-[#7A7A9A]">{label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-5">
        <h2 className="mb-4 font-display text-base font-bold text-white">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ icon: Icon, label, onClick, color }) => (
            <button
              key={label}
              onClick={onClick}
              className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${color} px-4 py-2 font-sans text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02]`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {recentActivity.length > 0 && (
        <div className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-5">
          <h2 className="mb-4 font-display text-base font-bold text-white">
            Recent Activity
          </h2>
          <div className="flex flex-col gap-3">
            {recentActivity.map((item, i) => (
              <Link
                key={`${item.type}-${i}`}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#1A1A2E]"
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    item.type === "project"
                      ? "bg-blue-500/10 text-blue-500"
                      : item.type === "post"
                        ? "bg-purple-500/10 text-purple-500"
                        : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {item.type === "project" ? (
                    <FolderKanban size={14} />
                  ) : item.type === "post" ? (
                    <FileText size={14} />
                  ) : (
                    <MessageSquare size={14} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-sm font-medium text-[#EEEEFF]">
                    {item.label}
                  </p>
                  <p className="font-sans text-xs text-[#7A7A9A]">{item.detail}</p>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-[#7A7A9A]">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <ArrowRight size={14} className="shrink-0 text-[#7A7A9A]" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
