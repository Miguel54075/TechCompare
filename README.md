# TechCompare

Comparador de peças de PC e periféricos (PWA). Next.js 15 (App Router) + Tailwind + shadcn/ui.

```bash
npm install
cp .env.example .env.local   # cole sua chave grátis do RAWG (rawg.io/apidocs)
npm run dev                  # http://localhost:3000
```

- Dados: `data/*.json` (valores de referência/MSRP e estimativas de ruído; confira antes de decidir uma compra).
- Adicionar produto: copie um item do JSON da categoria e altere os campos.
- Nova spec: adicione em `lib/categories.ts` (e, se quiser, um peso em `lib/recommend.ts`).
- PWA: `app/manifest.ts`, `public/sw.js`, `public/icons/`. O service worker só registra em produção.