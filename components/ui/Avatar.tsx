import React from "react";

interface AvatarProps {
  src?: string;
  fallback: string;
  size?: number;
}

export function Avatar({ src, fallback, size = 40 }: AvatarProps) {
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      {src ? <img src={src} alt="avatar" /> : <span>{fallback}</span>}
    </div>
  );
}
