import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import type { User, UserRole } from "~/types";

interface AppShellProps {
  children: React.ReactNode;
  role: UserRole;
  title: string;
  user?: User | null;
  actions?: React.ReactNode;
}

export function AppShell({ children, role, title, user, actions }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        role={role}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} user={user} actions={actions} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
