import "bootstrap-icons/font/bootstrap-icons.css";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./globals.css"; // your custom CSS
import "./globals.css";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import { UserProvider } from "@/components/context/context";
import { Toaster } from "react-hot-toast";
import { colorStyle } from "@/color";



export const metadata = {
  title: "Kumar Fashion Store",
  description:
    "Kumar Fashion Store Offers wide range of trendy tshirts, shirts, jeans and lowers. ",
  keywords:
    "kumar fashion store , jeans, lowers, trendy, tshirts, shirts, fashion, clothing, apparel, casual wear, stylish, comfortable, affordable, quality, versatile, modern, urban, streetwear, fashion-forward, wardrobe essentials",
  authors: [
    {
      name: "Kumar Fashion Store",
      url: "https://www.kumarfashion.com",
    },
  ],
};


export const viewport = {
  
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#ffffffff" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={colorStyle}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Kumar " />
        <link rel="canonical" href="https://kumarfashion.in/" />
      </head>
      <body>
         <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <UserProvider>
          <StoreHeader />
          {children}
          <StoreFooter />
        </UserProvider>
              <Toaster position="bottom-left" />
      </body>
    </html>
  );
}
