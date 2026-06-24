import { useState } from "react";
import type { Creature } from "@/utils/openfray/schema";
import { Container } from "./Container";
import { Brand } from "./Brand";

export function Importer(props: {
  creature: Creature;
  setShowOptions: (show: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(props.creature, null, 2);

  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.creature.id.replace(/^.*:/, "") || "creature"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <Brand subtitle="Importer" />
      <div className="flex min-h-0 flex-grow flex-col">
        <h3 className="truncate font-semibold text-slate-200">{props.creature.name}</h3>
        <pre className="mt-1 min-h-0 flex-grow overflow-y-auto rounded-md border border-slate-800 bg-slate-900 p-2 font-mono text-xs text-slate-300">
          {json}
        </pre>
        <div className="flex flex-row gap-2 pt-3">
          <button
            onClick={copy}
            className="flex-grow rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            {copied ? "Copied!" : "Copy JSON"}
          </button>
          <button
            onClick={download}
            className="flex-grow rounded-md border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            Download .json
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => props.setShowOptions(true)}
        className="self-end text-xs font-medium text-indigo-400 hover:text-indigo-300"
      >
        Options
      </button>
    </Container>
  );
}
