import { PageHeaderSkeleton, StatsBarSkeleton, TopicGridSkeleton } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <main className="container" style={{ paddingBottom: "6rem", maxWidth: "1200px" }}>
      <PageHeaderSkeleton hasBadge maxWidth="800px" />
      <StatsBarSkeleton count={4} />
      <TopicGridSkeleton count={3} />
    </main>
  );
}
