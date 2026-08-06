import { useRef, useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardHeader } from "./card";
import { Button } from "./button";

function HoverScrollingText({ text, className, as: Component = "div" }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    if (isHovered && containerRef.current) {
      const el = containerRef.current;
      const overflow = el.scrollWidth - el.clientWidth;
      if (overflow > 0) {
        setScrollDistance(overflow);
      } else {
        setScrollDistance(0);
      }
    } else {
      setScrollDistance(0);
    }
  }, [isHovered, text]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="overflow-hidden w-full relative"
    >
      <Component
        ref={containerRef}
        className={className}
        style={{
          whiteSpace: "nowrap",
          textOverflow: isHovered && scrollDistance > 0 ? "clip" : "ellipsis",
          overflow: isHovered && scrollDistance > 0 ? "visible" : "hidden",
          display: "block",
          transform: `translateX(-${scrollDistance}px)`,
          transition:
            isHovered && scrollDistance > 0
              ? `transform ${scrollDistance * 0.015}s linear`
              : "transform 0.3s ease-out",
        }}
      >
        {text}
      </Component>
    </div>
  );
}

function formatTitle(title) {
  if (!title) return "";
  const t = String(title).trim();
  if (t.length === 0) return "";
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

function formatCompany(company) {
  if (!company) return "";
  return String(company).trim().toUpperCase();
}

export function JobCard({ job, onApply }) {
  return (
    <Card
      className="relative flex flex-col justify-between overflow-hidden hover:border-text/30"
      style={{ maxWidth: "280px", width: "100%" }}
    >
      <CardHeader className="p-3.5 flex flex-col space-y-3">
        <div
          className="flex items-center justify-between w-full pb-2.5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="relative group inline-flex items-center">
            <a
              href="https://peviitor.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center group/logo"
              aria-label="peViitor.ro"
            >
              <img
                src="peviitor-logo.svg"
                alt="peViitor.ro"
                className="h-5 w-auto object-contain transition-all duration-200 group-hover/logo:brightness-50 dark:brightness-200 dark:group-hover/logo:brightness-125"
              />
            </a>
            <div className="absolute left-0 top-full mt-1.5 hidden group-hover:flex items-center z-50 pointer-events-none">
              <div className="bg-slate-900 text-slate-100 text-[11px] font-medium px-2.5 py-1 rounded-[10px] whitespace-nowrap border border-slate-700/60">
                Deschide peViitor.ro
              </div>
            </div>
          </div>

          <Button
            onClick={() => onApply(job)}
            size="sm"
            className="h-7 px-3 text-[12px] tracking-wide font-bold flex items-center gap-1.5 rounded-lg shrink-0"
            aria-label={`Aplică la jobul ${job.title} de la ${job.company}`}
          >
            <span>Aplică</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-start justify-between gap-2 w-full pt-0.5">
          <div className="flex gap-3 items-center min-w-0 flex-1">
            <div
              className={`h-10 w-10 rounded-xl ${job.logoBg} flex items-center justify-center font-bold text-sm shrink-0`}
              aria-hidden="true"
            >
              {job.company.split(" ")[0].substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <HoverScrollingText
                as="h3"
                text={formatTitle(job.title)}
                className="text-xs font-bold text-text-h m-0 text-left leading-snug"
              />
              <HoverScrollingText
                text={formatCompany(job.company)}
                className="text-[11px] font-semibold text-text text-left mt-0.5"
              />
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
