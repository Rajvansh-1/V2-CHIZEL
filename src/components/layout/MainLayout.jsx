import { Outlet } from "react-router-dom";
import CustomCursor from "@components/layout/CustomCursor";
import useLenisScroll from "@hooks/useLenisScroll"; // Import the new hook

const MainLayout = () => {
  useLenisScroll(); // Initialize Lenis smooth scroll

  return (
    <>
      <CustomCursor />
      <main className="relative w-full min-h-screen bg-background">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;