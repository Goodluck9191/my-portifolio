import { useState, useEffect, useCallback } from "react";

const VISITOR_ID_KEY = "glp_visitor_id";

/**
 * Generates or retrieves a privacy-conscious anonymous visitor identifier.
 * Stored in localStorage so like state persists across page refreshes.
 * The ID is a random UUID - no personal data is stored.
 */
export function useVisitorId(): string {
  const [visitorId, setVisitorId] = useState<string>(
    () =>
      (typeof window !== "undefined" && localStorage.getItem(VISITOR_ID_KEY)) ||
      `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );

  useEffect(() => {
    // Ensure we have a stable stored ID
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) {
      setVisitorId(existing);
      return;
    }
    const id = crypto.randomUUID();
    try {
      localStorage.setItem(VISITOR_ID_KEY, id);
      setVisitorId(id);
    } catch {
      // localStorage blocked — keep existing state
    }
  }, []);

  return visitorId;
}
