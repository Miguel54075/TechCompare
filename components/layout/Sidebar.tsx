import Link from "next/link";
import { CATEGORY_LIST } from "@/lib/categories";
import { PRODUCTS } from "@/lib/products";

export function Sidebar() {
  return (
    <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 border-r p-4 lg:block">
      <p className="mb-2 px-2 text-xs text-muted-foreground">Categorias</p>
      <nav className="flex flex-col gap-0.5">
        {CATEGORY_LIST.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={`/compare?cat=${id}`}
            className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <Icon className="size-4" />
              {label}
            </span>
            <span className="text-xs tabular-nums">{PRODUCTS[id].length}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
