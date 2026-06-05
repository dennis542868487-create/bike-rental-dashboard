type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section>
      <h1 style={{ margin: 0 }}>{title}</h1>
      {description ? <p style={{ color: '#6b7280' }}>{description}</p> : null}
    </section>
  );
}
