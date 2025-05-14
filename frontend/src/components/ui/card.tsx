import React from 'react';

export function Card({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-white shadow-md rounded-lg p-4 ${className || ''}`}>{children}</div>;
}

export function CardContent({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="mt-2">{children}</div>;
}

