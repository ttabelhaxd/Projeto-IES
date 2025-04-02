import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";
import { Toaster } from "@/components/ui/toaster"

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <ScrollTop />
      <div className="flex-grow">
        <Outlet />
        <Toaster />
      </div>
      <Footer />
    </div>
  );
}
