type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section>
      <h1 style={{ margin: 0 }}>{title}</h1>
      {description ? (
        <p style={{ margin: '6px 0 0', fontSize: 15, lineHeight: '22px', color: 'var(--text-secondary)' }}>{description}</p>
      ) : null}
    </section>
  );
}
