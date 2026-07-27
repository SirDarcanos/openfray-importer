import { GearIcon } from "./GearIcon";

/** Opens the options view, from the right end of the header row. */
export function OptionsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Options"
      title="Options"
      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
    >
      <GearIcon className="h-5 w-5" />
    </button>
  );
}
