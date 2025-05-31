"use client";

import { useState } from "react";
import Chat from "@/components/chat";
import Logs from "@/components/logs";
import Analytics from "@/components/analytics";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const views = {
  chat: <Chat />,
  logs: <Logs />,
  analytics: <Analytics />,
};

export default function HomePage() {
  const [view, setView] = useState<"chat" | "logs" | "analytics">("chat");

  const NavButton = ({ label, value }: { label: string; value: typeof view }) => (
    <div
      onClick={() => setView(value)}
      className={`w-full text-center py-1 rounded-md font-semibold cursor-pointer ${
        view === value
          ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]"
          : "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
      }`}
    >
      {label}
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-48 p-4">
            <div className="flex flex-col items-center justify-center mt-12 space-y-2">
              <NavButton label="Chat" value="chat" />
              <NavButton label="Logs" value="logs" />
              <NavButton label="Analytics" value="analytics" />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-48 border-r p-4 border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
        <div className="flex flex-col items-center justify-center w-full space-y-2 mt-8">
          <NavButton label="Chat" value="chat" />
          <NavButton label="Logs" value="logs" />
          <NavButton label="Analytics" value="analytics" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[var(--background)] text-[var(--foreground)] overflow-y-auto">
        {views[view]}
      </div>
    </div>
  );
}

