"use client";

import { Check, Plus } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { formatValue } from "@/lib/compare";
import { getProductValue } from "@/lib/products";
import { cn } from "@/lib/utils";
import type { Product, ProfileId } from "@/lib/types";
import { TagBadges } from "./TagBadges";

interface Props {
  product: Product;
  tags: ProfileId[];
  selected: boolean;
  disabled?: boolean;
  onToggle: (id: string) => void;
}

export function ProductCard({ product, tags, selected, disabled, onToggle }: Props) {
  const cat = CATEGORIES[product.category];

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled && !selected}
      onClick={() => onToggle(product.id)}
      className={cn(
        "flex h-full flex-col gap-3 rounded-lg border bg-card p-4 text-left transition-colors",
        "hover:border-muted-foreground/40 disabled:cursor-not-allowed disabled:opacity-40",
        selected && "border-primary bg-primary/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <p className="font-semibold leading-snug">{product.name}</p>
        </div>
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full border",
            selected ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {selected ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
        </span>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-xs">
        {cat.highlights.map((key) => {
          const def = cat.specs.find((s) => s.key === key)!;
          return (
            <div key={key} className="min-w-0">
              <dt className="truncate text-muted-foreground">{def.label}</dt>
              <dd className="truncate font-medium">{formatValue(def, getProductValue(product, key))}</dd>
            </div>
          );
        })}
      </dl>

      <div className="mt-auto flex items-end justify-between gap-2">
        <TagBadges tags={tags} />
        {product.price_usd && (
          <span className="shrink-0 text-sm font-medium tabular-nums">US$ {product.price_usd}</span>
        )}
      </div>
    </button>
  );
}
