import React from "react";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "outline" | "elevated";
}

export const Card = ({ className, variant = "elevated", ...props }: CardProps) => {
  return <div className={`card ${variant} ${className}`} {...props} />;
};

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`card-header ${className}`} {...props} />
);

