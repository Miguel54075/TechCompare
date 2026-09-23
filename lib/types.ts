export type CategoryId = "mice" | "keyboards" | "headsets" | "gpus" | "monitors";
export type ProfileId = "productivity" | "competitive" | "immersion" | "editing";
export type SpecValue = string | number | string[];

/**
 * Formato pensado para migrar para o Supabase:
 * `specs` vira uma coluna jsonb; o resto são colunas normais.
 */
export interface Product {
  id: string;
  category: CategoryId;
  brand: string;
  name: string;
  price_usd?: number;
  /** Dica manual que reforça o algoritmo de tags */
  profile_hints?: ProfileId[];
  specs: Record<string, SpecValue | undefined>;
}
