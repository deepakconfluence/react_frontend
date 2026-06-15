export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-card text-xs text-muted-foreground py-3 px-6 flex items-center justify-between">
      <span>© {year} Confluence Enterprise SaaS. All rights reserved.</span>
      <span className="hidden sm:inline">v1.0.0</span>
    </footer>
  );
}
