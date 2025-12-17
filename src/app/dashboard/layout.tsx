"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Dumbbell, 
  TrendingUp, 
  Trophy, 
  Settings, 
  Menu, 
  X,
  User
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Meus Treinos", href: "/dashboard/treinos", icon: Dumbbell },
  { name: "Progresso", href: "/dashboard/progresso", icon: TrendingUp },
  { name: "Desafios", href: "/dashboard/desafios", icon: Trophy },
  { name: "Perfil", href: "/dashboard/perfil", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A4D2E] via-[#2D5F3F] to-[#1A4D2E]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white/95 backdrop-blur-sm shadow-2xl
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#4ADE80]/20">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#1A4D2E]">FUTPOWER</h1>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={24} />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive 
                        ? "bg-gradient-to-r from-[#4ADE80] to-[#22C55E] text-white hover:from-[#22C55E] hover:to-[#4ADE80]" 
                        : "text-gray-700 hover:bg-[#4ADE80]/10"
                    }`}
                  >
                    <item.icon className="mr-3" size={20} />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Settings */}
          <div className="p-4 border-t border-[#4ADE80]/20">
            <Link href="/dashboard/configuracoes">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-[#4ADE80]/10"
              >
                <Settings className="mr-3" size={20} />
                Configurações
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-white/95 backdrop-blur-sm shadow-md p-4 flex items-center justify-between sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </Button>
          <h1 className="text-xl font-bold text-[#1A4D2E]">FUTPOWER</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
