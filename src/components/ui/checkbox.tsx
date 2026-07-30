"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    const id = props.id || React.useId();
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-start gap-2.5">
          <div className="relative mt-0.5 flex shrink-0">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              className="peer sr-only"
              {...props}
            />
            <label
              htmlFor={id}
              className={cn(
                "flex size-4 cursor-pointer items-center justify-center rounded border transition-colors",
                "border-[rgba(204,219,220,0.35)] bg-[rgba(44,44,44,0.8)]",
                "peer-focus-visible:border-[rgba(65,102,245,0.8)] peer-focus-visible:ring-1 peer-focus-visible:ring-[rgba(65,102,245,0.8)]",
                "peer-checked:border-[#fca311] peer-checked:bg-[#fca311]",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                error && "border-red-400"
              )}
            >
              <Check className="size-3 text-[#2c2c2c] opacity-0 peer-checked:opacity-100" strokeWidth={3} />
            </label>
          </div>
          {label && (
            <label htmlFor={id} className="cursor-pointer text-sm leading-snug text-[#f0f0f0]">
              {label}
            </label>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
