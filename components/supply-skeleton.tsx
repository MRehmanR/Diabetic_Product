export function SupplyCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="aspect-[4/3] bg-muted animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded animate-shimmer w-3/4" />
        <div className="h-3 bg-muted rounded animate-shimmer w-full" />
        <div className="h-3 bg-muted rounded animate-shimmer w-2/3" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 bg-muted rounded animate-shimmer w-24" />
          <div className="h-8 bg-muted rounded animate-shimmer w-24" />
        </div>
      </div>
    </div>
  );
}

export function SupplyDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-4 bg-muted rounded animate-shimmer w-32 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square bg-muted rounded-xl animate-shimmer" />
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-shimmer w-3/4" />
          <div className="h-6 bg-muted rounded animate-shimmer w-1/3" />
          <div className="h-4 bg-muted rounded animate-shimmer w-full" />
          <div className="h-4 bg-muted rounded animate-shimmer w-full" />
          <div className="h-4 bg-muted rounded animate-shimmer w-2/3" />
          <div className="h-10 bg-muted rounded animate-shimmer w-40" />
        </div>
      </div>
    </div>
  );
}
