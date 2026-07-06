import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";
import { cn } from "../lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "card-base card-hover rounded-xl border border-border bg-card p-5 text-sm",
        className
      )}
      {...props}
    />
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: "primary" | "secondary" | "ghost" }
>(function Button({ className, variant = "primary", asChild = false, ...props }, ref) {
  const Comp = asChild ? Slot : "button";

  const styles =
    variant === "primary"
      ? "bg-accent text-accentFg shadow-soft hover:bg-accent/90 focus-visible:ring-accent/40"
      : variant === "secondary"
        ? "border border-border bg-card text-fg hover:bg-stone-50 hover:border-accent/30 focus-visible:ring-accent/30"
        : "bg-transparent text-fg hover:bg-stone-100 focus-visible:ring-accent/30";

  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.98]",
        styles,
        className
      )}
      {...props}
    />
  );
});

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-fg placeholder:text-muted/60 outline-none transition-all duration-200 focus:border-accent/60 focus:ring-2 focus:ring-accent/15 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-fg placeholder:text-muted/60 outline-none transition-all duration-200 focus:border-accent/60 focus:ring-2 focus:ring-accent/15 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-accent/20 bg-accent/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent",
        className
      )}
      {...props}
    />
  );
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-xl bg-stone-100", className)} {...props} />
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
      <div
        className="h-full rounded-full bg-accent transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
