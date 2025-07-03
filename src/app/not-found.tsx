import { Suspense } from "react";

import { Loader } from "@/app/components/Loader";

// Force dynamic rendering to avoid SSR issues with useSearchParams
export const dynamic = "force-dynamic";

function NotFoundContent() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        404 - Page Not Found
      </h1>
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        style={{
          color: "var(--theme-color)",
          textDecoration: "underline",
          fontSize: "1.1rem",
        }}
      >
        Back to Home
      </a>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<Loader role="status" aria-label="Loading..." />}>
      <NotFoundContent />
    </Suspense>
  );
}
