import { Suspense } from "react";

import { Loader } from "@/app/components/ui/loader";

import styles from "./NotFound.module.scss";

// Force dynamic rendering to avoid SSR issues with useSearchParams
export const dynamic = "force-dynamic";

export const NotFoundContent = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.notFound__container}>
        <h1 className={styles.notFound__title}>404 - Sayfa Bulunamadı</h1>
        <p className={styles.notFound__description}>
          Aradığınız sayfa mevcut değil.
        </p>
        <a href="/" className={styles.notFound__link}>
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
};

export default function NotFound() {
  return (
    <Suspense fallback={<Loader role="status" aria-label="Loading..." />}>
      <NotFoundContent />
    </Suspense>
  );
}
