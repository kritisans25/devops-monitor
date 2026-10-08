import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  Server,
  Globe,
  Box,
  Settings,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: Activity,
    },
    {
      name: 'Endpoints',
      path: '/endpoints',
      icon: Globe,
    },
    {
      name: 'Containers',
      path: '/containers',
      icon: Box,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-[#000000] border-r border-[#292D30] flex flex-col justify-between transition-transform duration-150 ease-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-[#292D30] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-center text-[#9281F7]">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#FFFFFF] tracking-tight flex items-center gap-1.5">
                  OpsMonitor
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9281F7]" />
                </div>
                <div className="text-[11px] text-[#A1A4A5] font-mono">
                  DevOps Monitoring
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-[6px] text-[#A1A4A5] hover:text-[#FFFFFF] hover:bg-[#111419] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2.5 space-y-1">
            <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#6E727A] font-mono">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-2.5 px-3 py-2 text-xs font-medium rounded-[6px] transition-colors duration-150 ${
                      isActive
                        ? 'bg-[#000000] text-[#FFFFFF] font-medium border-l-2 border-[#9281F7] border-y border-r border-transparent'
                        : 'text-[#A1A4A5] hover:text-[#FFFFFF] hover:bg-[#0A0A0C] border-l-2 border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#9281F7]' : 'text-[#A1A4A5]'}`} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}

            <div className="pt-3 px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#6E727A] font-mono">
              System
            </div>

            {/* Settings Preview */}
            <div className="flex items-center justify-between px-3 py-2 text-xs text-[#6E727A] cursor-not-allowed border-l-2 border-transparent">
              <div className="flex items-center space-x-2.5">
                <Settings className="w-4 h-4 shrink-0 text-[#6E727A]" />
                <span>Settings</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-[#000000] text-[#6E727A] border border-[#292D30]">
                Soon
              </span>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer - Clean Technical Status Module */}
        <div className="p-3 border-t border-[#292D30]">
          <div className="p-2.5 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3AD389] animate-pulse-live" />
              <div>
                <div className="text-[11px] font-medium text-[#F0F0F0] font-mono">
                  System Online
                </div>
                <div className="text-[10px] font-mono text-[#6E727A]">
                  Agent v2.4.1
                </div>
              </div>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#3AD389]" />
          </div>
        </div>
      </aside>
    </>
  );
}

