"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import { CATEGORIES, CATEGORY_LIST, isCategoryId } from "@/lib/categories";
import { PRODUCTS } from "@/lib/products";
import { getRecommendedTags } from "@/lib/recommend";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/compare/ProductCard";
import { SpecTable } from "@/components/compare/SpecTable";

const MIN = 2;
const MAX = 4;

function CompareContent() {
  const params = useSearchParams();
  const initialCat = params.get("cat");
  const [categoryId, setCategoryId] = useState<CategoryId>(isCategoryId(initialCat) ? initialCat : "mice");
  const [ids, setIds] = useState<string[]>(() => {
    const valid = new Set(PRODUCTS[isCategoryId(initialCat) ? initialCat : "mice"].map((p) => p.id));
    return (params.get("ids")?.split(",") ?? []).filter((id) => valid.has(id)).slice(0, MAX);
  });

  const category = CATEGORIES[categoryId];
  const products = PRODUCTS[categoryId];
  const selected = ids.map((id) => products.find((p) => p.id === id)!).filter(Boolean);
  const tagsById = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, getRecommendedTags(p, products)])),
    [products]
  );

  // Mantém a URL compartilhável sem recarregar a página.
  function syncUrl(cat: CategoryId, next: string[]) {
    const q = new URLSearchParams({ cat });
    if (next.length) q.set("ids", next.join(","));
    window.history.replaceState(null, "", `/compare?${q}`);
  }

  function changeCategory(cat: CategoryId) {
    setCategoryId(cat);
    setIds([]);
    syncUrl(cat, []);
  }

  function toggle(id: string) {
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : ids.length < MAX ? [...ids, id] : ids;
    setIds(next);
    syncUrl(categoryId, next);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Comparador</h1>
        <p className="text-sm text-muted-foreground">
          Selecione de {MIN} a {MAX} {category.label.toLowerCase()} para comparar lado a lado.
        </p>
      </header>

      <div role="tablist" aria-label="Categoria" className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORY_LIST.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={id === categoryId}
            onClick={() => changeCategory(id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
              id === categoryId
                ? "border-primary bg-primary/10 text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-muted-foreground">
            {selected.length} de {MAX} selecionados
          </h2>
          {selected.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIds([]);
                syncUrl(categoryId, []);
              }}
            >
              <Trash2 />
              Limpar seleção
            </Button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              tags={tagsById[p.id]}
              selected={ids.includes(p.id)}
              disabled={ids.length >= MAX}
              onToggle={toggle}
            />
          ))}
        </div>
      </section>

      <section>
        {selected.length >= MIN ? (
          <SpecTable category={category} products={selected} allProducts={products} onRemove={toggle} />
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            Escolha pelo menos {MIN} produtos para ver a tabela de comparação.
          </div>
        )}
      </section>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando…</p>}>
      <CompareContent />
    </Suspense>
  );
}
