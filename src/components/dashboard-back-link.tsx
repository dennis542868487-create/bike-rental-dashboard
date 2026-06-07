import Link from 'next/link';

type DashboardBackLinkProps = {
  href: string;
  label: string;
};

export function DashboardBackLink({ href, label }: DashboardBackLinkProps) {
  return (
    <Link href={href} style={{ color: 'var(--info)', textDecoration: 'none', width: 'fit-content' }}>
      ← {label}
    </Link>
  );
}
