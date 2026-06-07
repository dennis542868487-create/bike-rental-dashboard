'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = { href: string; label: string };

type DashboardNavProps = {
  navItems: NavItem[];
  externalLinks: NavItem[];
};

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav({ navItems, externalLinks }: DashboardNavProps) {
  const pathname = usePathname() ?? '';
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav style={{ display: 'grid', gap: 4 }}>
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        const isHover = hovered === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            onMouseEnter={() => setHovered(item.href)}
            onMouseLeave={() => setHovered((cur) => (cur === item.href ? null : cur))}
            style={{
              display: 'block',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: active ? 600 : 500,
              textDecoration: 'none',
              color: active ? 'var(--primary)' : 'var(--text-secondary)',
              background: active ? 'var(--primary-soft)' : isHover ? 'var(--surface-muted)' : 'transparent',
              borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
              paddingLeft: 12,
            }}
          >
            {item.label}
          </Link>
        );
      })}

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />

      {externalLinks.map((item) => {
        const isHover = hovered === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(item.href)}
            onMouseLeave={() => setHovered((cur) => (cur === item.href ? null : cur))}
            style={{
              display: 'block',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              color: 'var(--text-muted)',
              background: isHover ? 'var(--surface-muted)' : 'transparent',
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
