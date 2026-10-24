"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-150">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-5 shadow-card flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <div className="flex items-center gap-1">
                <Skeleton className="w-7 h-7 rounded-lg" />
                <Skeleton className="w-7 h-7 rounded-lg" />
              </div>
            </div>

            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-2/3 rounded-md" />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-baseline justify-between">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
