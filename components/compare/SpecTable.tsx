"use client";

import { Check, Trophy, X } from "lucide-react";
import type { CategoryDef } from "@/lib/categories";
import { formatValue, getWinners } from "@/lib/compare";
import { getProductValue } from "@/lib/products";
import { getRecommendedTags } from "@/lib/recommend";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { TagBadges } from "./TagBadges";

interface Props {
  category: CategoryDef;
  products: Product[];
  allProducts: Product[];
  onRemove: (id: string) => void;
}

export function SpecTable({ category, products, allProducts, onRemove }: Props) {
  const rows = category.specs.map((def) => {
    const values = products.map((p) => getProductValue(p, def.key));
    return { def, values, winners: getWinners(def, values) };
  });

  const wins = products.map((_, i) =>
    rows.reduce((n, r) => n + (r.winners[i] ? 1 : 0), 0)
  );
  const topWins = Math.max(...wins);
  const leaders = topWins > 0 ? wins.filter((w) => w === topWins).length : 0;

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="sticky left-0 z-10 w-44 bg-card p-4 text-left font-medium text-muted-foreground">
              Especificação
            </th>
            {products.map((p, i) => (
              <th key={p.id} className="p-4 text-left align-top">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-normal text-muted-foreground">{p.brand}</p>
                    <p className="font-semibold leading-snug">{p.name}</p>
                    {leaders === 1 && wins[i] === topWins && (
                      <Badge className="mt-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                        <Trophy className="size-3" />
                        Mais vitórias
                      </Badge>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(p.id)}
                    aria-label={`Remover ${p.name}`}
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map(({ def, values, winners }) => (
            <tr key={def.key} className="border-b last:border-0">
              <th
                scope="row"
                className="sticky left-0 z-10 bg-card p-4 text-left align-top font-medium"
                title={def.hint}
              >
                {def.label}
                {def.hint && <p className="mt-0.5 text-xs font-normal text-muted-foreground">{def.hint}</p>}
              </th>
              {values.map((v, i) => (
                <td
                  key={products[i].id}
                  className={cn(
                    "p-4 align-top",
                    winners[i] && "bg-emerald-500/15 font-semibold text-emerald-300"
                  )}
                >
                  {def.type === "list" && Array.isArray(v) ? (
                    <div className="flex flex-wrap gap-1.5">
                      {v.map((item) => (
                        <Badge key={item} className="bg-muted text-foreground">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      {winners[i] && <Check className="size-4" aria-label="Melhor valor" />}
                      {formatValue(def, v)}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}

          <tr className="border-b">
            <th scope="row" className="sticky left-0 z-10 bg-card p-4 text-left align-top font-medium">
              Recomendado para
            </th>
            {products.map((p) => (
              <td key={p.id} className="p-4 align-top">
                <TagBadges tags={getRecommendedTags(p, allProducts)} />
              </td>
            ))}
          </tr>

          <tr className="bg-muted/40">
            <th scope="row" className="sticky left-0 z-10 bg-muted p-4 text-left font-medium">
              Specs vencidas
            </th>
            {wins.map((w, i) => (
              <td key={products[i].id} className="p-4 font-semibold tabular-nums">
                {w}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
