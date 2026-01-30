import "bootstrap-icons/font/bootstrap-icons.css";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./globals.css"; // your custom CSS
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/basic/Navbar";
import Footer from "@/components/basic/footer";
import { UserProvider } from "@/components/context/context";
import SearchProducts from "@/components/home/SearchProducts";
import { Toaster } from "react-hot-toast";
import Navbarr from "@/components/basic/NayaNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Kumar " />
        <link rel="canonical" href="https://kumarfashion.in/" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
         <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <UserProvider>
          {/* <Navbar /> */}
          <Navbarr/>
          <SearchProducts />
          {children}
          <Footer />
        </UserProvider>
              <Toaster position="bottom-left" />
      </body>
    </html>
  );
}
