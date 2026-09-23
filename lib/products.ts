import mice from "@/data/mice.json";
import keyboards from "@/data/keyboards.json";
import headsets from "@/data/headsets.json";
import gpus from "@/data/gpus.json";
import monitors from "@/data/monitors.json";
import type { CategoryId, Product, SpecValue } from "./types";

/**
 * Fonte de dados única. Para migrar para o Supabase, troque este objeto por
 * consultas (`supabase.from("products").select("*").eq("category", id)`).
 */
export const PRODUCTS: Record<CategoryId, Product[]> = {
  mice: mice as unknown as Product[],
  keyboards: keyboards as unknown as Product[],
  headsets: headsets as unknown as Product[],
  gpus: gpus as unknown as Product[],
  monitors: monitors as unknown as Product[],
};

export function getProductValue(p: Product, key: string): SpecValue | undefined {
  return key === "price_usd" ? p.price_usd : p.specs[key];
}
