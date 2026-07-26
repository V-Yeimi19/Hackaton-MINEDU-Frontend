"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavItem } from "@/lib/auth/nav-config";
import type { SessionUser } from "@/lib/api/token";
import appIcon from "@/app/icon.png";

// Pick the longest matching href as active so a parent route (e.g. the
// role's home path) doesn't stay highlighted on every one of its sub-routes.
function useActiveHref(items: NavItem[]) {
  const pathname = usePathname();
  return items
    .filter((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

export function Sidebar({ role }: { role: SessionUser["role"] }) {
  const items = NAV_ITEMS[role];
  const activeHref = useActiveHref(items);

  return (
    <aside className="glass-ink fixed left-0 top-0 z-30 hidden h-full w-64 flex-col gap-2 rounded-none py-2 lg:flex">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image
              src={appIcon}
              alt="Aula Digital"
              fill
              priority
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div>
            <h1 className="text-headline-md font-semibold text-inverse-on-surface">Aula Digital</h1>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {items.map((item) => {
          const active = item.href === activeHref;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-4 py-3 text-label-md transition-all",
                active
                  ? "border-l-4 border-primary-container bg-white/5 font-bold text-primary-container"
                  : "text-inverse-on-surface/70 hover:bg-white/10 hover:text-primary-container"
              )}
            >
              <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// Compact horizontal nav shown below the topbar on mobile/tablet, where the
// fixed sidebar is hidden — without it, roles with more than one nav item
// would have no way to navigate below the `lg` breakpoint.
export function MobileNav({ role }: { role: SessionUser["role"] }) {
  const items = NAV_ITEMS[role];
  const activeHref = useActiveHref(items);

  if (items.length <= 1) return null;

  return (
    <nav className="glass-ink flex gap-1 overflow-x-auto rounded-none px-4 py-2 lg:hidden">
      {items.map((item) => {
        const active = item.href === activeHref;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-label-md transition-colors",
              active
                ? "bg-white/10 font-bold text-primary-container"
                : "text-inverse-on-surface/70 hover:bg-white/10"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
