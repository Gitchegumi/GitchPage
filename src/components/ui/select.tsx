"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-[#f0f0f0]">
            {label}
            {props.required && <span className="ml-1 text-[#fca311]">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "h-9 w-full appearance-none rounded-md border bg-[rgba(44,44,44,0.8)] px-3 py-1 pr-8 text-sm text-[#f0f0f0] shadow-xs outline-none transition-[color,box-shadow]",
              "border-[rgba(204,219,220,0.35)] focus:border-[rgba(65,102,245,0.8)] focus:ring-1 focus:ring-[rgba(65,102,245,0.8)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-400 focus:border-red-400 focus:ring-red-400",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-[rgba(240,240,240,0.45)]" />
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
