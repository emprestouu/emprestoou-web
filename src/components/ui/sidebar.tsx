'use client'

import { useState } from 'react'
import {
  Home,
  Users,
  Wallet,
  Settings,
  Menu,
  Smartphone,
  DoorOpen,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SignOutButton } from '@clerk/clerk-react'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: 'Clientes',
      href: '/dashboard/clientes',
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: 'Empréstimos',
      href: '/dashboard/emprestimos',
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      name: 'Cobrança',
      href: '/dashboard/cobranca',
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      name: 'Configurações',
      href: '/dashboard/configuracoes',
      icon: <Settings className="w-5 h-5" />,
    },
  ]

  return (
    <div
      className={cn(
        'h-screen bg-gray-900 text-white flex flex-col p-4 transition-all',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Botão de Expandir/Reduzir */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-6 p-2 rounded-lg hover:bg-gray-800 transition flex items-center space-x-3"
      >
        <Menu className="w-6 h-6" />
        {!isCollapsed && <span className="text-lg font-bold">Emprestoou</span>}
      </button>

      {/* Menu */}
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition"
          >
            {item.icon}
            {!isCollapsed && <span className="text-sm">{item.name}</span>}
          </Link>
        ))}
        <SignOutButton signOutOptions={{ redirectUrl: '/' }}>
          <button className="flex items-center w-full space-x-3 gap-2 p-2 rounded-lg hover:bg-gray-800 transition">
            <DoorOpen /> Sair
          </button>
        </SignOutButton>
      </nav>
    </div>
  )
}
