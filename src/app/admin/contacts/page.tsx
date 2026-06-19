"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../layout";
import type { Contact } from "@/lib/types";

export default function AdminContactsPage() {
  const { token } = useAdmin();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch("/api/contact", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setContacts(data.data ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, [token]);

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
          className="w-fit font-sans text-sm text-[#6C63FF] hover:text-[#00D4FF]"
        >
          &larr; Back to all contacts
        </button>
        <div className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-6">
          <div className="mb-4 flex items-start justify-between">
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
          </div>
          {selected.project_type && (
            <p className="font-sans text-sm text-[#7A7A9A]">
              Project Type: {selected.project_type}
            </p>
          )}
          {selected.budget && (
            <p className="font-sans text-sm text-[#7A7A9A]">
              Budget: {selected.budget}
            </p>
          )}
          <hr className="my-4 border-[#2A2A38]" />
          <p className="font-sans text-sm leading-relaxed text-[#EEEEFF] whitespace-pre-wrap">
            {selected.message}
          </p>
          <p className="mt-4 font-mono text-xs text-[#7A7A9A]">
            {new Date(selected.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Contacts</h1>
        <p className="font-sans text-sm text-[#7A7A9A]">
          {contacts.length} message{contacts.length !== 1 ? "s" : ""}
        </p>
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
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-[#22223A] transition-colors hover:bg-[#0F0F1A]/50"
                >
                  <td className="px-4 py-3 font-sans text-sm text-[#EEEEFF]">
                    {contact.name}
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
                    <button
                      onClick={() => setSelected(contact)}
                      className="rounded-lg px-3 py-1.5 font-sans text-xs text-[#6C63FF] transition-colors hover:bg-[#6C63FF]/10"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
