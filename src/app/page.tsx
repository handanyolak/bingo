import { Suspense } from "react";

import { Bingo } from "@/app/components/Bingo";
import { Loader } from "@/app/components/ui/loader";

// Force dynamic rendering to avoid SSR issues with useSearchParams
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <Suspense fallback={<Loader role="status" aria-label="Loading..." />}>
      <Bingo />
    </Suspense>
  );
}
