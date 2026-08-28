import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";
import { cn } from "../lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "card-base card-hover rounded-2xl border border-[#2E2C28] bg-[#1A1916] p-5 text-sm",
        className
      )}
      {...props}
    />
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: "primary" | "secondary" | "ghost" | "danger" }
>(function Button({ className, variant = "primary", asChild = false, ...props }, ref) {
  const Comp = asChild ? Slot : "button";

  const styles =
    variant === "primary"
      ? "bg-[#D4872A] text-[#0F0E0D] hover:bg-[#F0A93C] focus-visible:ring-[#D4872A]/40 font-bold shadow-[0_0_16px_rgb(212_135_42/0.25)]"
      : variant === "secondary"
        ? "border border-[#2E2C28] bg-[#1A1916] text-[#F2EDDE] hover:bg-[#232118] hover:border-[#D4872A]/40 focus-visible:ring-[#D4872A]/30"
        : variant === "danger"
          ? "border border-[#C0392B]/40 bg-[#C0392B]/10 text-[#C0392B] hover:bg-[#C0392B]/20 focus-visible:ring-[#C0392B]/30"
          : "bg-transparent text-[#F2EDDE] hover:bg-[#232118] focus-visible:ring-[#D4872A]/30";

  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0E0D] disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.97]",
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
        "w-full rounded-xl border border-[#2E2C28] bg-[#1A1916] px-4 py-3 text-sm text-[#F2EDDE] placeholder:text-[#8A8475] outline-none transition-all duration-200 focus:border-[#D4872A]/60 focus:ring-2 focus:ring-[#D4872A]/15 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
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
        "w-full rounded-xl border border-[#2E2C28] bg-[#1A1916] px-4 py-3 text-sm text-[#F2EDDE] placeholder:text-[#8A8475] outline-none transition-all duration-200 focus:border-[#D4872A]/60 focus:ring-2 focus:ring-[#D4872A]/15 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
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
        "inline-flex items-center rounded-full border border-[#D4872A]/25 bg-[#D4872A]/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#D4872A]",
        className
      )}
      {...props}
    />
  );
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-xl bg-[#2E2C28]", className)} {...props} />
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2E2C28]">
      <div
        className="h-full rounded-full bg-[#D4872A] transition-all duration-500 shadow-[0_0_8px_rgb(212_135_42/0.5)]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
