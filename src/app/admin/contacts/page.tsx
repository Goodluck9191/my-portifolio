"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import * as Lucide from "lucide-react";
import { useAdmin } from "../layout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Contact } from "@/lib/types";

const ITEMS_PER_PAGE = 10;

export default function AdminContactsPage() {
  const { token } = useAdmin();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchContacts() {
    try {
      const res = await fetch("/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data.data ?? []);
      }
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q);
      const matchesStatus =
        filterStatus === "All" || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const updateStatus = useCallback(
    async (contact: Contact, newStatus: string) => {
      setUpdating(contact.id);
      try {
        const res = await fetch(`/api/contact`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: contact.id, status: newStatus }),
        });
        if (!res.ok) throw new Error();
        setContacts((prev) =>
          prev.map((c) =>
            c.id === contact.id ? { ...c, status: newStatus as Contact["status"] } : c
          )
        );
        if (selected?.id === contact.id) {
          setSelected((prev) => prev ? { ...prev, status: newStatus as Contact["status"] } : null);
        }
        toast.success(`Marked as ${newStatus}`);
      } catch {
        toast.error("Failed to update status");
      } finally {
        setUpdating(null);
      }
    },
    [token, selected]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      const res = await fetch(`/api/contact`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (!res.ok) throw new Error();
      setContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  }, [deleteTarget, token, selected]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6C63FF] border-t-transparent" />
      </div>
    );
  }

  if (selected) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={() => setSelected(null)}
          className="flex w-fit items-center gap-1 font-sans text-sm text-[#6C63FF] hover:text-[#00D4FF]"
        >
          <Lucide.ArrowLeft size={16} />
          Back to all messages
        </button>
        <div className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                {selected.name}
              </h2>
              <a
                href={`mailto:${selected.email}`}
                className="font-sans text-sm text-[#6C63FF] hover:underline"
              >
                {selected.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              {selected.status !== "read" && (
                <button
                  onClick={() => updateStatus(selected, "read")}
                  disabled={updating === selected.id}
                  className="rounded-lg border border-[#2A2A38] px-3 py-1.5 font-sans text-xs text-blue-400 transition-colors hover:bg-blue-500/10 disabled:opacity-40"
                >
                  Mark Read
                </button>
              )}
              {selected.status !== "replied" && (
                <button
                  onClick={() => updateStatus(selected, "replied")}
                  disabled={updating === selected.id}
                  className="rounded-lg border border-[#2A2A38] px-3 py-1.5 font-sans text-xs text-green-400 transition-colors hover:bg-green-500/10 disabled:opacity-40"
                >
                  Mark Replied
                </button>
              )}
              <a
                href={`mailto:${selected.email}?subject=Re: Portfolio Contact`}
                className="rounded-lg border border-[#2A2A38] px-3 py-1.5 font-sans text-xs text-[#00D4FF] transition-colors hover:bg-[#00D4FF]/10"
              >
                <Lucide.Mail size={14} className="inline-block mr-1" />
                Reply
              </a>
              <button
                onClick={() => setDeleteTarget(selected)}
                disabled={deleting === selected.id}
                className="rounded-lg border border-[#2A2A38] px-3 py-1.5 font-sans text-xs text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-40"
              >
                <Lucide.Trash2 size={14} className="inline-block mr-1" />
                Delete
              </button>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium ${
              selected.status === "unread"
                ? "bg-yellow-500/10 text-yellow-500"
                : selected.status === "read"
                  ? "bg-blue-500/10 text-blue-500"
                  : "bg-green-500/10 text-green-500"
            }`}
          >
            {selected.status}
          </span>
          {selected.project_type && (
            <p className="mt-3 font-sans text-sm text-[#7A7A9A]">
              Project Type: {selected.project_type}
            </p>
          )}
          {selected.budget && (
            <p className="font-sans text-sm text-[#7A7A9A]">
              Budget: {selected.budget}
            </p>
          )}
          <hr className="my-4 border-[#2A2A38]" />
          <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#EEEEFF]">
            {selected.message}
          </p>
          <p className="mt-4 font-mono text-xs text-[#7A7A9A]">
            {new Date(selected.created_at).toLocaleString()}
          </p>
        </div>
        <ConfirmDialog
          open={!!deleteTarget && deleteTarget.id === selected.id}
          title="Delete Message"
          message={`Are you sure you want to delete this message from ${deleteTarget?.name}? This cannot be undone.`}
          confirmLabel={deleting === deleteTarget?.id ? "Deleting..." : "Delete"}
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Messages</h1>
        <p className="font-sans text-sm text-[#7A7A9A]">
          {filtered.length} of {contacts.length} message{contacts.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Lucide.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A9A]" />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-[#2A2A38] bg-[#0F0F1A] py-2 pl-10 pr-4 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF]"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] px-3 py-2 font-sans text-sm text-[#EEEEFF] outline-none focus:border-[#6C63FF]"
        >
          <option value="All">All Statuses</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-6 text-center">
          <p className="font-sans text-sm text-[#7A7A9A]">
            No messages yet. They&apos;ll appear here once your contact form receives submissions.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#2A2A38]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A38] bg-[#0F0F1A]">
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Name</th>
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Email</th>
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Status</th>
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Date</th>
                <th className="px-4 py-3 text-right font-mono text-xs font-medium text-[#7A7A9A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-[#22223A] transition-colors hover:bg-[#0F0F1A]/50"
                >
                  <td className="px-4 py-3 font-sans text-sm text-[#EEEEFF]">
                    <button
                      onClick={() => setSelected(contact)}
                      className="hover:text-[#6C63FF] transition-colors text-left"
                    >
                      {contact.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-[#7A7A9A]">
                    {contact.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                        contact.status === "unread"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : contact.status === "read"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-[#7A7A9A]">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {contact.status === "unread" && (
                        <button
                          onClick={() => updateStatus(contact, "read")}
                          disabled={updating === contact.id}
                          className="rounded-lg p-2 text-blue-400 transition-colors hover:bg-blue-500/10 disabled:opacity-40"
                          title="Mark Read"
                        >
                          <Lucide.Eye size={16} />
                        </button>
                      )}
                      <a
                        href={`mailto:${contact.email}?subject=Re: Portfolio Contact`}
                        className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#00D4FF]"
                        title="Reply"
                      >
                        <Lucide.Mail size={16} />
                      </a>
                      <button
                        onClick={() => setSelected(contact)}
                        className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
                        title="View"
                      >
                        <Lucide.MessageSquare size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(contact)}
                        disabled={deleting === contact.id}
                        className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                        title="Delete"
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
                    No messages match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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
        title="Delete Message"
        message={`Are you sure you want to delete the message from "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel={deleting === deleteTarget?.id ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
