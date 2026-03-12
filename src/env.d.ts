// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_NOLIMIT_API_KEY: string
  // ajoute d'autres variables si besoin
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}