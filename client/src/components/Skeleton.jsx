// Skeleton.jsx
// Loading placeholder bars, used instead of a spinner on pages where the
// user is waiting for a list/grid of content (doctor cards, appointment
// lists) - it hints at the shape of what's loading, which feels faster
// and more polished than a plain spinner.

import React from "react";

export function SkeletonLine({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
      <SkeletonLine className="w-20 h-20 rounded-full mx-auto mb-3" />
      <SkeletonLine className="h-4 w-2/3 mx-auto mb-2" />
      <SkeletonLine className="h-3 w-1/2 mx-auto mb-2" />
      <SkeletonLine className="h-3 w-1/3 mx-auto" />
    </div>
  );
}

export function SkeletonCardGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700 flex justify-between items-center">
      <div className="space-y-2 flex-1">
        <SkeletonLine className="h-4 w-1/3" />
        <SkeletonLine className="h-3 w-1/4" />
      </div>
      <SkeletonLine className="h-6 w-20 rounded-full" />
    </div>
  );
}

export function SkeletonRowList({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
