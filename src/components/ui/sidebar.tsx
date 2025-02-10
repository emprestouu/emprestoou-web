"use client";

import { useState } from "react";
import { Home, Users, Wallet, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Clientes", href: "/clientes", icon: <Users className="w-5 h-5" /> },
    { name: "Empréstimos", href: "/emprestimos", icon: <Wallet className="w-5 h-5" /> },
    { name: "Configurações", href: "/configuracoes", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className={cn("h-screen bg-gray-900 text-white flex flex-col p-4 transition-all", isCollapsed ? "w-16" : "w-64")}>
      {/* Botão de Expandir/Reduzir */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-6 p-2 rounded-lg hover:bg-gray-800 transition"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Menu */}
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition">
            {item.icon}
            {!isCollapsed && <span className="text-sm">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
