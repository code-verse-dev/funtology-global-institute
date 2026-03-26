/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PDF_WORKER_SRC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
