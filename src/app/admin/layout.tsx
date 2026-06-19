"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
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
];

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAdmin();

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
                pathname === href
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("admin_token");
    const storedEmail = sessionStorage.getItem("admin_email");
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setUser({ email: storedEmail });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (token && pathname === "/admin/login") {
      router.replace("/admin");
    } else if (!token && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [token, pathname, loading, router]);

  function logout() {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_email");
    setToken(null);
    setUser(null);
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08080E]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6C63FF] border-t-transparent" />
      </div>
    );
  }

  if (pathname === "/admin/login" && !token) {
    return <div className="flex min-h-screen bg-[#08080E]">{children}</div>;
  }

  if (!token) return null;

  return (
    <AdminContext.Provider value={{ token, user, logout }}>
      <div className="flex min-h-screen bg-[#08080E]">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1">
          <header className="flex items-center gap-4 border-b border-[#22223A] bg-[#0F0F1A] px-4 py-3 md:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-[#7A7A9A] md:hidden"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="ml-auto font-sans text-xs text-[#7A7A9A] hover:text-[#EEEEFF]">
              View Site &nearr;
            </Link>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
