"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useSafePathname() {
  const pathname = usePathname();
  const [safePathname, setSafePathname] = useState<string | null>(null);

  useEffect(() => {
    setSafePathname(pathname);
  }, [pathname]);

  return safePathname;
}
