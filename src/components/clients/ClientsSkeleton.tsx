"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function ClientsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-700/60">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between"
          >
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-xl" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
            <Skeleton className="w-11 h-11 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-card">
        {/* Search & Filter Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Skeleton className="h-9 w-full max-w-md rounded-xl" />
            <Skeleton className="h-8 w-36 rounded-xl" />
          </div>
          <Skeleton className="h-3.5 w-28 rounded-md" />
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50 p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="py-3 px-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
              </div>

              <div className="hidden sm:block space-y-1.5">
                <Skeleton className="h-3.5 w-28 rounded-md" />
                <Skeleton className="h-3 w-36 rounded-md" />
              </div>

              <div className="hidden md:block space-y-1.5">
                <Skeleton className="h-3.5 w-32 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>

              <div className="text-right space-y-1.5">
                <Skeleton className="h-4 w-20 rounded-md ml-auto" />
                <Skeleton className="h-3 w-14 rounded-md ml-auto" />
              </div>

              <div className="flex items-center gap-1.5">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
