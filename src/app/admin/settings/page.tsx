"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "../layout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function AdminSettingsPage() {
  const { token } = useAdmin();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const { data } = await res.json();
        setSettings(data ?? {});
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const updateSetting = useCallback(
    async (key: string, value: string) => {
      setSaving((prev) => ({ ...prev, [key]: true }));
      try {
        const res = await fetch("/api/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ key, value }),
        });
        if (!res.ok) throw new Error();
        setSettings((prev) => ({ ...prev, [key]: value }));
        toast.success("Setting saved");
      } catch {
        toast.error("Failed to save setting");
      } finally {
        setSaving((prev) => ({ ...prev, [key]: false }));
      }
    },
    [token]
  );

  const addSetting = useCallback(async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    await updateSetting(newKey.trim(), newValue.trim());
    setNewKey("");
    setNewValue("");
  }, [newKey, newValue, updateSetting]);

  const deleteSetting = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key: deleteTarget }),
      });
      if (!res.ok) throw new Error();
      setSettings((prev) => {
        const next = { ...prev };
        delete next[deleteTarget];
        return next;
      });
      toast.success("Setting deleted");
    } catch {
      toast.error("Failed to delete setting");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, token]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6C63FF] border-t-transparent" />
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-[#2A2A38] bg-[#16162A] px-4 py-2 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF]";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
        <p className="font-sans text-sm text-[#7A7A9A]">
          {Object.keys(settings).length} setting{Object.keys(settings).length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-end gap-3 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-4">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">Key</label>
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className={inputClass}
            placeholder="e.g. site_title"
          />
        </div>
        <div className="flex-[2] flex flex-col gap-1.5">
          <label className="font-sans text-xs text-[#7A7A9A]">Value</label>
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className={inputClass}
            placeholder="e.g. Goodluck Johnson"
          />
        </div>
        <button
          onClick={addSetting}
          disabled={!newKey.trim() || !newValue.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-4 py-2 font-sans text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {Object.keys(settings).length === 0 ? (
        <div className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-6 text-center">
          <p className="font-sans text-sm text-[#7A7A9A]">
            No settings yet. Add your first setting above.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#2A2A38]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A38] bg-[#0F0F1A]">
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Key</th>
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Value</th>
                <th className="px-4 py-3 text-right font-mono text-xs font-medium text-[#7A7A9A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(settings).map(([key, value]) => (
                <SettingRow
                  key={key}
                  settingKey={key}
                  value={value}
                  onSave={updateSetting}
                  onDelete={setDeleteTarget}
                  saving={!!saving[key]}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Setting"
        message={`Are you sure you want to delete "${deleteTarget}"? This cannot be undone.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={deleteSetting}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function SettingRow({
  settingKey,
  value,
  onSave,
  onDelete,
  saving,
}: {
  settingKey: string;
  value: string;
  onSave: (key: string, value: string) => Promise<void>;
  onDelete: (key: string) => void;
  saving: boolean;
}) {
  const [editValue, setEditValue] = useState(value);
  const isDirty = editValue !== value;

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const inputClass =
    "w-full rounded-lg border border-[#2A2A38] bg-[#16162A] px-3 py-1.5 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF]";

  return (
    <tr className="border-b border-[#22223A] transition-colors hover:bg-[#0F0F1A]/50">
      <td className="px-4 py-3">
        <code className="font-mono text-sm text-[#00D4FF]">{settingKey}</code>
      </td>
      <td className="px-4 py-3">
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className={inputClass}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isDirty) onSave(settingKey, editValue);
          }}
        />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          {isDirty && (
            <button
              onClick={() => onSave(settingKey, editValue)}
              disabled={saving}
              className="rounded-lg p-2 text-green-400 transition-colors hover:bg-green-500/10 disabled:opacity-40"
              title="Save"
            >
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            </button>
          )}
          <button
            onClick={() => onDelete(settingKey)}
            className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-red-500/10 hover:text-red-400"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
