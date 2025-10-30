import "@/app/globals.css";
import { UserProvider } from "@/components/context/context";

export const metadata = {
  title: "Admin Panel - Kumar Fashion Store",
  description: "Manage products, orders, and customers from the Admin Panel",
};

export default function AdminPanelLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {/* ✅ No Navbar / No Footer for Admin */}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
