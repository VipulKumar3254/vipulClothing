import Script from "next/script";
import StoreHome from "@/components/store/StoreHome";

export default function HomePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      ["Jeans", "/jeans-for-men"],
      ["Shirts", "/shirts-for-men"],
      ["Joggers", "/joggers-for-men"],
      ["T-Shirts", "/tshirts-for-men"],
    ].map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `https://kumarfashion.in${path}`,
    })),
  };

  return <>
    <StoreHome />
    <Script id="breadcrumb-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
  </>;
}
