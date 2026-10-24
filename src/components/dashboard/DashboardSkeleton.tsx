"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardHeroSkeleton() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-700/60">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-7 w-48 md:w-60 rounded-xl" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32 rounded-lg" />
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <Skeleton className="h-4 w-28 rounded-lg" />
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <Skeleton className="h-4 w-20 rounded-lg" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Skeleton className="h-10 w-44 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
    </div>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-28 rounded-md" />
            <Skeleton className="w-9 h-9 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-36 rounded-xl" />
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/50">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CashflowChartSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-5 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-36 rounded-lg" />
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-64 rounded-md" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-3.5 w-20 rounded-md" />
          <Skeleton className="h-3.5 w-20 rounded-md" />
        </div>
      </div>

      <div className="pt-6 pb-2">
        <div className="h-44 flex items-end gap-3 sm:gap-8 justify-between border-b border-slate-100 dark:border-slate-700/60 px-4 sm:px-8">
          {[40, 75, 55, 90, 60, 85].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end pb-2">
              <div className="w-full flex items-end justify-center gap-1.5 h-full">
                <Skeleton className="w-3 sm:w-4 rounded-t-md" style={{ height: `${height}%` }} />
                <Skeleton className="w-3 sm:w-4 rounded-t-md" style={{ height: `${Math.round(height * 0.7)}%` }} />
              </div>
              <Skeleton className="h-3 w-10 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-5 w-32 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentInvoicesTableSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-card overflow-hidden">
      {/* Header & Tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-9 w-60 rounded-xl" />
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700/50 p-2 sm:p-4 space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="py-3 px-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-40 rounded-md" />
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-center gap-1">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right space-y-1.5">
                <Skeleton className="h-4 w-24 rounded-md ml-auto" />
                <Skeleton className="h-5 w-16 rounded-full ml-auto" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardFullSkeleton() {
  return (
    <div className="space-y-6">
      <DashboardHeroSkeleton />
      <div className="h-10 w-full rounded-xl bg-slate-100/90 dark:bg-slate-800/60 animate-pulse" />
      <StatCardsSkeleton />
      <CashflowChartSkeleton />
      <RecentInvoicesTableSkeleton />
    </div>
  );
}
