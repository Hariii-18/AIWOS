import { AlertCircle } from "lucide-react";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="min-h-full">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Coming soon placeholder */}
      <div
        className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border"
        style={{
          background: "var(--card)",
          borderColor: "var(--border-light)",
        }}
      >
        <AlertCircle
          size={48}
          className="mb-4"
          style={{ color: "var(--faint)" }}
        />
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          Coming Soon
        </h2>
        <p className="text-sm text-muted-foreground">
          This feature is currently under development.
        </p>
      </div>
    </div>
  );
}
