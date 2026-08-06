import { useRef, useEffect, useCallback } from "react";
import { JobCard } from "../components/ui/JobCard";
import { Search, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardFooter } from "../components/ui/card";

function EmptyJobCard({ totalJobsCount, onResetFilter }) {
  const isNoDataAtAll = totalJobsCount === 0;

  return (
    <Card
      className="relative flex flex-col justify-between overflow-hidden bg-bg-card shadow-sm animate-fade-in mx-auto"
      style={{ maxWidth: "280px", width: "100%" }}
    >
      <CardHeader className="p-4 pb-3 flex flex-col space-y-3">
        <div className="flex gap-3 items-center w-full">
          <div
            className={`h-10 w-10 rounded-xl bg-linear-to-br ${
              isNoDataAtAll
                ? "from-red-500 to-rose-600"
                : "from-slate-500 to-slate-700"
            } flex items-center justify-center text-white shrink-0 shadow-sm`}
            aria-hidden="true"
          >
            {isNoDataAtAll ? (
              <RefreshCw className="w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <h3 className="text-xs font-bold text-text-h m-0 text-left leading-snug">
              {isNoDataAtAll ? "Eroare încărcare" : "Fără joburi"}
            </h3>
            <p className="text-[11px] font-semibold text-text text-left mt-0.5">
              {isNoDataAtAll
                ? "Reîncearcă mai târziu"
                : "Selectează alt filtru"}
            </p>
          </div>
        </div>
        <p className="text-[11px] text-text text-left m-0 leading-relaxed font-normal">
          {isNoDataAtAll
            ? "Nu am putut descărca ofertele de muncă. Te rugăm să reîncarci pagina sau să încerci mai târziu."
            : "Nu am găsit nicio ofertă disponibilă pentru facultatea selectată. Modifică filtrul pentru a vedea joburi."}
        </p>
      </CardHeader>
      <CardFooter className="pb-0 px-0 pt-0 flex items-center">
        <Button
          onClick={() => {
            if (isNoDataAtAll) {
              window.location.reload();
            } else {
              onResetFilter();
            }
          }}
          className="w-full text-xs rounded-none py-0 h-8"
        >
          {isNoDataAtAll ? "Reîncarcă pagina" : "Toate joburile"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function JobsWrapper({
  filteredJobs,
  totalJobsCount,
  onResetFilter,
  onApply,
}) {
  const cardRefs = useRef([]);
  const listRef = useRef(null);

  const updateHeight = useCallback(() => {
    if (!listRef.current) return;
    const heights = cardRefs.current
      .filter(Boolean)
      .map((el) => el.offsetHeight);
    if (heights.length === 0) return;
    const visibleCount = Math.min(heights.length, 2);
    const cardH = Math.max(...heights);
    const gapH = 12;
    const totalH = cardH * visibleCount + gapH * (visibleCount - 1) + 8;
    listRef.current.style.maxHeight = `${totalH}px`;
  }, []);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, filteredJobs.length);
    const observer = new ResizeObserver(updateHeight);
    cardRefs.current.filter(Boolean).forEach((el) => observer.observe(el));
    updateHeight();
    return () => observer.disconnect();
  }, [filteredJobs, updateHeight]);

  return (
    <div className="flex flex-col gap-3">
      {filteredJobs.length === 0 ? (
        <EmptyJobCard
          totalJobsCount={totalJobsCount}
          onResetFilter={onResetFilter}
        />
      ) : (
        <div
          ref={listRef}
          role="list"
          aria-label="Listă locuri de muncă"
          className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden p-1 snap-y snap-mandatory"
        >
          {filteredJobs.map((job, idx) => (
            <div
              key={job.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              role="listitem"
              className="snap-start shrink-0"
            >
              <JobCard job={job} onApply={onApply} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
