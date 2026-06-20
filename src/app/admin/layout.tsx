"use client";

import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Settings,
  Image,
} from "lucide-react";

interface AdminContextType {
  token: string | null;
  user: { email: string } | null;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  token: null,
  user: null,
  logout: () => {},
});

export const useAdmin = () => useContext(AdminContext);

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const breadcrumbLabels: Record<string, string> = {
  admin: "Admin",
  projects: "Projects",
  posts: "Posts",
  contacts: "Contacts",
  media: "Media",
  settings: "Settings",
  login: "Login",
  new: "New",
};

function Breadcrumbs({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return null;

  return (
    <nav className="flex items-center gap-2 font-mono text-xs text-[#7A7A9A]">
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const label = breadcrumbLabels[seg] ?? seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const isLast = i === segments.length - 1;
        return (
          <span key={href} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            {isLast ? (
              <span className="text-[#EEEEFF]">{label}</span>
            ) : (
              <Link href={href} className="transition-colors hover:text-[#EEEEFF]">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAdmin();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-[#22223A] bg-[#0F0F1A] transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#22223A] p-4">
          <Link href="/admin" className="font-display text-lg font-bold text-white">
            Admin
          </Link>
          <button onClick={onClose} className="text-[#7A7A9A] md:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm transition-all duration-200 ${
                isActive(href)
                  ? "bg-gradient-to-r from-[#6C63FF]/20 to-[#00D4FF]/20 text-[#6C63FF]"
                  : "text-[#7A7A9A] hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#22223A] p-3">
          <div className="mb-2 px-3 font-sans text-xs text-[#7A7A9A]">
            {user?.email}
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm text-red-400 transition-colors hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

const emptyAuth = { token: null as string | null, user: null as { email: string } | null };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(emptyAuth);
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const inactivityRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const logoutRef = useRef(() => {});

  const logout = useCallback(() => {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_email");
    setAuth(emptyAuth);
    router.replace("/admin/login");
  }, [router]);

  logoutRef.current = logout;

  // On every pathname change: read sessionStorage, update auth, redirect
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    const email = sessionStorage.getItem("admin_email");
    const hasAuth = !!(token && email);

    if (hasAuth) {
      setAuth({ token, user: { email } });
    } else {
      setAuth(emptyAuth);
    }
    setReady(true);

    if (hasAuth && pathname === "/admin/login") {
      router.replace("/admin");
    } else if (!hasAuth && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  // Auto-logout after 30 minutes of inactivity
  const resetTimer = useCallback(() => {
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      logoutRef.current();
    }, 30 * 60 * 1000);
  }, []);

  useEffect(() => {
    if (!auth.token) return;
    resetTimer();
    window.addEventListener("mousemove", resetTimer, { passive: true });
    window.addEventListener("keydown", resetTimer, { passive: true });
    window.addEventListener("click", resetTimer, { passive: true });
    window.addEventListener("scroll", resetTimer, { passive: true });
    return () => {
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [auth.token, resetTimer]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08080E]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6C63FF] border-t-transparent" />
      </div>
    );
  }

  if (pathname === "/admin/login" && !auth.token) {
    return <div className="flex min-h-screen items-center justify-center bg-[#08080E]">{children}</div>;
  }

  if (!auth.token) return null;

  return (
    <AdminContext.Provider value={{ token: auth.token, user: auth.user, logout }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0F0F1A",
            border: "1px solid #22223A",
            color: "#EEEEFF",
          },
        }}
      />
      <div className="flex min-h-screen bg-[#08080E]">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-4 border-b border-[#22223A] bg-[#0F0F1A] px-4 py-3 md:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-[#7A7A9A] md:hidden"
            >
              <Menu size={20} />
            </button>
            <Breadcrumbs pathname={pathname} />
            <Link href="/" className="ml-auto shrink-0 font-sans text-xs text-[#7A7A9A] hover:text-[#EEEEFF]">
              View Site &nearr;
            </Link>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
