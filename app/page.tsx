import Link from "next/link";
import { ArrowRight, Check, Gamepad2 } from "lucide-react";
import { CATEGORY_LIST, CATEGORIES } from "@/lib/categories";
import { getWinners, formatValue } from "@/lib/compare";
import { PRODUCTS } from "@/lib/products";
import { getProductValue } from "@/lib/products";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/** Mini comparação real, calculada com os mesmos dados e regras do comparador. */
function LivePreview() {
  const cat = CATEGORIES.mice;
  const pair = PRODUCTS.mice.filter((p) =>
    ["logitech-g-pro-x-superlight-2", "logitech-mx-master-3s"].includes(p.id)
  );
  const keys = ["dpi_max", "polling_hz", "weight_g", "price_usd"];

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left font-medium text-muted-foreground">Mouses</th>
            {pair.map((p) => (
              <th key={p.id} className="p-3 text-left font-semibold">
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => {
            const def = cat.specs.find((s) => s.key === key)!;
            const values = pair.map((p) => getProductValue(p, key));
            const winners = getWinners(def, values);
            return (
              <tr key={key} className="border-b last:border-0">
                <th scope="row" className="p-3 text-left font-normal text-muted-foreground">
                  {def.label}
                </th>
                {values.map((v, i) => (
                  <td
                    key={pair[i].id}
                    className={cn(
                      "p-3 tabular-nums",
                      winners[i] && "bg-emerald-500/15 font-semibold text-emerald-300"
                    )}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {winners[i] && <Check className="size-4" />}
                      {formatValue(def, v)}
                    </span>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-14">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Veja qual peça vence em cada especificação.
          </h1>
          <p className="max-w-md text-muted-foreground">
            Escolha de 2 a 4 produtos da mesma categoria. O melhor valor de cada linha fica em verde,
            e cada item recebe uma tag de uso: produtividade, competitivo, imersão ou edição.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/compare" className={buttonVariants()}>
              Começar a comparar
              <ArrowRight />
            </Link>
            <Link href="/games" className={buttonVariants({ variant: "outline" })}>
              <Gamepad2 />
              Buscar por jogo
            </Link>
          </div>
        </div>
        <LivePreview />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Categorias</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_LIST.map(({ id, label, description, icon: Icon }) => (
            <Link
              key={id}
              href={`/compare?cat=${id}`}
              className="group rounded-lg border bg-card p-5 transition-colors hover:border-muted-foreground/40"
            >
              <div className="mb-3 flex items-center justify-between">
                <Icon className="size-5 text-primary" />
                <span className="text-xs text-muted-foreground">{PRODUCTS[id].length} produtos</span>
              </div>
              <p className="font-semibold">{label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
