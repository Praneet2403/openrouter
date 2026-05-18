import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

type AlertBannerProps = {
  message: string;
  className?: string;
  onDismiss?: () => void;
};

export function ErrorBanner({ message, className, onDismiss }: AlertBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

export function SuccessBanner({ message, className, onDismiss }: AlertBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200",
        className,
      )}
    >
      <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
