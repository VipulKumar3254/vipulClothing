"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const searchFromUrl = searchParams.get("search") || "";
  const [search, setSearch] = useState("");

  // 🔹 URL → Input (Amazon logic)
  useEffect(() => {
    setSearch(searchFromUrl);
  }, [searchFromUrl]);

  // 🔹 Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    router.push(`/search?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <html lang="en">
      <body>
     
        {children}
      </body>
    </html>
  );
}
