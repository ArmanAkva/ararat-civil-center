import { PageHeaderSkeleton, CivilizationsGridSkeleton } from "@/components/ui/Skeleton";

export default function CivilizationsLoading() {
  return (
    <main className="container" style={{ paddingBottom: "5rem" }}>
      {/* Page Header Skeleton */}
      <PageHeaderSkeleton hasBadge maxWidth="760px" />

      {/* 8 Civilizations Grid Skeleton */}
      <CivilizationsGridSkeleton count={8} />
    </main>
  );
}
