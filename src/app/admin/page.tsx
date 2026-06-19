"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderKanban, FileText, MessageSquare, Eye } from "lucide-react";
import { useAdmin } from "./layout";

export default function AdminDashboard() {
  const { token } = useAdmin();
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    unreadContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectsRes, postsRes, contactsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/posts"),
          fetch("/api/contact", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // contacts endpoint doesn't have a GET, so we just count projects/posts
        const projects = await projectsRes.json();
        const posts = await postsRes.json();

        setStats({
          projects: projects.data?.length ?? 0,
          posts: posts.data?.length ?? 0,
          unreadContacts: 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [token]);

  const cards = [
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
      label: "Unread Contacts",
      value: stats.unreadContacts,
      href: "/admin/contacts",
      color: "from-green-500/20 to-emerald-500/20",
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
        {cards.map(({ icon: Icon, label, value, href, color }) => (
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
        <div className="flex items-center gap-3">
          <Eye size={20} className="text-[#6C63FF]" />
          <div>
            <p className="font-sans text-sm font-medium text-[#EEEEFF]">
              Quick Links
            </p>
            <p className="font-sans text-xs text-[#7A7A9A]">
              Manage your portfolio content from the sidebar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
