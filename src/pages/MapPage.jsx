import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";

function MapPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default MapPage;
