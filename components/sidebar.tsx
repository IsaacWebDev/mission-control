'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, ListTodo, Layers, Activity, Terminal, Coins, Brain, Calendar, Zap, Webhook, Bell } from 'lucide-react';

const nav = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Agents', href: '/agents', icon: Users },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  { name: 'Sessions', href: '/sessions', icon: Layers },
];

const observe = [
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'Logs', href: '/logs', icon: Terminal },
  { name: 'Tokens', href: '/tokens', icon: Coins },
  { name: 'Memory', href: '/memory', icon: Brain },
];

const automate = [
  { name: 'Cron', href: '/cron', icon: Calendar },
  { name: 'Spawn', href: '/spawn', icon: Zap },
  { name: 'Webhooks', href: '/webhooks', icon: Webhook },
  { name: 'Alerts', href: '/alerts', icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[240px] glass-sidebar flex flex-col fixed left-0 top-0 h-screen z-40">
      <div className="p-5 border-b border-white/[0.08]">
        <h1 className="text-lg font-semibold text-white/95">Mission Control</h1>
      </div>

      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        <div>
          {nav.map(item => (
            <NavItem key={item.name} item={item} active={pathname === item.href} />
          ))}
        </div>

        <div>
          <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2 px-3">
            Observe
          </div>
          {observe.map(item => (
            <NavItem key={item.name} item={item} active={pathname === item.href} />
          ))}
        </div>

        <div>
          <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2 px-3">
            Automate
          </div>
          {automate.map(item => (
            <NavItem key={item.name} item={item} active={pathname === item.href} />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-white/70">Connected</span>
        </div>
      </div>
    </div>
  );
}

function NavItem({ item, active }: any) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 h-9 rounded-lg mb-1 text-sm transition-all duration-200 ${
        active 
          ? 'bg-white/[0.10] text-white/95 border-l-2 border-blue-500' 
          : 'text-white/70 hover:text-white/95 hover:bg-white/[0.06]'
      }`}
    >
      <item.icon className="w-4 h-4" />
      <span className="text-white">{item.name}</span>
    </Link>
  );
}
