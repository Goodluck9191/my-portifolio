"use client";

type SkeletonVariant = "blog" | "project";

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

function Block({ className }: { className?: string }) {
  return (
    <Shimmer
      className={`rounded-md bg-[#16162A] ${className ?? ""}`}
    />
  );
}

export function SkeletonCard({ variant }: { variant: SkeletonVariant }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#22223A] bg-[#0F0F1A]">
      <Block className="aspect-video w-full rounded-none" />

      <div className="flex flex-col gap-3 p-5">
        {variant === "blog" ? (
          <>
            <Block className="h-[22px] w-20 rounded-full" />
            <Block className="h-5 w-full" />
            <Block className="h-5 w-3/4" />
            <Block className="h-4 w-full" />
            <div className="mt-1 border-t border-[#22223A] pt-3">
              <Block className="h-4 w-1/3" />
            </div>
          </>
        ) : (
          <>
            <Block className="h-[22px] w-20 rounded-full" />
            <Block className="h-6 w-full" />
            <Block className="h-4 w-full" />
            <div className="flex flex-wrap gap-2">
              <Block className="h-[26px] w-16 rounded-md" />
              <Block className="h-[26px] w-20 rounded-md" />
              <Block className="h-[26px] w-14 rounded-md" />
            </div>
            <div className="mt-1 flex items-center gap-4">
              <Block className="h-4 w-24" />
              <Block className="h-4 w-16" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function SkeletonFeatured() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#22223A] bg-[#0F0F1A] md:flex-row">
      <Block className="aspect-video w-full rounded-none md:w-1/2" />
      <div className="flex flex-col gap-4 p-6 md:w-1/2 md:p-8">
        <Block className="h-[22px] w-24 rounded-full" />
        <Block className="h-8 w-full" />
        <Block className="h-8 w-3/4" />
        <Block className="h-4 w-full" />
        <Block className="h-4 w-1/2" />
        <Block className="h-4 w-32" />
      </div>
    </div>
  );
}
