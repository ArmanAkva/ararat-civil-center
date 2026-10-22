import {
  PageHeaderSkeleton,
  StatsBarSkeleton,
  FilterBarSkeleton,
  TopicGridSkeleton,
} from "@/components/ui/Skeleton";

export default function DialogueLoading() {
  return (
    <main className="container" style={{ paddingBottom: "6rem", maxWidth: "1200px" }}>
      {/* Hero Header Skeleton */}
      <PageHeaderSkeleton hasBadge maxWidth="880px" />

      {/* KPI Stats Bar Skeleton */}
      <StatsBarSkeleton count={4} />

      {/* Search & Filter Bar Skeleton */}
      <FilterBarSkeleton />

      {/* Topics Grid Skeleton */}
      <TopicGridSkeleton count={6} />
    </main>
  );
}
