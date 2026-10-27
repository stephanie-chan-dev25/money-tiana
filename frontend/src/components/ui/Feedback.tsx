export function Loading({ label = "Loading…" }: { label?: string }) {
  return <div className="feedback"><span className="spinner" />{label}</div>;
}
export function ErrorMessage({ children }: { children: string }) {
  return <div className="alert alert-error" role="alert">{children}</div>;
}
export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><div className="empty-icon">◇</div><strong>{title}</strong><p>{description}</p></div>;
}
