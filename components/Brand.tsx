import { CrossedSwordsIcon } from "./CrossedSwordsIcon";

/** The OpenFray brand lockup: crossed swords + two-tone wordmark, with a subtitle. */
export function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-indigo-400">
        <CrossedSwordsIcon className="h-6 w-6" />
      </span>
      <div className="leading-tight">
        <div className="text-base font-semibold tracking-tight text-slate-100">
          <span className="text-indigo-400">Open</span>Fray
        </div>
        {subtitle && (
          <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
