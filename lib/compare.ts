import type { SpecDef } from "./categories";
import type { SpecValue } from "./types";

/** Retorna, para cada valor, se ele é o vencedor da linha. */
export function getWinners(def: SpecDef, values: (SpecValue | undefined)[]): boolean[] {
  const none = values.map(() => false);
  if (def.better === "none" || def.type === "list") return none;

  let scores: (number | null)[];
  if (def.better === "ranked") {
    scores = values.map((v) => {
      const i = def.rank?.indexOf(String(v)) ?? -1;
      return i >= 0 ? i : null;
    });
  } else {
    const sign = def.better === "higher" ? 1 : -1;
    scores = values.map((v) => (typeof v === "number" ? v * sign : null));
  }

  const valid = scores.filter((s): s is number => s !== null);
  if (valid.length < 2) return none;
  const best = Math.max(...valid);
  if (valid.every((s) => s === best)) return none; // empate geral: sem destaque
  return scores.map((s) => s === best);
}

export function formatValue(def: SpecDef, v: SpecValue | undefined): string {
  if (v === undefined || v === null || v === "") return "—";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "number") {
    const n =
      def.key === "price_usd"
        ? v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : v.toLocaleString("pt-BR");
    return `${def.prefix ?? ""}${n}${def.unit ? ` ${def.unit}` : ""}`;
  }
  return v;
}
