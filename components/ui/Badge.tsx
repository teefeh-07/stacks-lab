import React from "react";

interface BadgeProps {
  variant?: "default" | "secondary" | "destructive";
  children: React.ReactNode;
}

export function Badge({ variant = "default", children }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
