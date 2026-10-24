"use client";

import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/60 ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ className = "w-24 h-4", ...props }: SkeletonProps) {
  return <Skeleton className={`rounded-md ${className}`} {...props} />;
}

export function SkeletonAvatar({ size = "w-9 h-9", className = "" }: { size?: string; className?: string }) {
  return <Skeleton className={`rounded-xl shrink-0 ${size} ${className}`} />;
}

export function SkeletonBadge({ className = "w-16 h-5" }: { className?: string }) {
  return <Skeleton className={`rounded-full ${className}`} />;
}
