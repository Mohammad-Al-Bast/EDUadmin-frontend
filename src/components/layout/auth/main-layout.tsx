import { Link, Outlet, useLocation } from "react-router-dom";
import { ModeToggle } from "../../theme/mode-toggle";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

interface MainLayoutProps {
  routes: {
    path: string;
    component: React.ComponentType;
    label: string;
    subtitle?: string;
  }[];
}
const MainLayout: React.FC<MainLayoutProps> = ({ routes }) => {
  const location = useLocation();
  const currentRoute = routes.find((route) =>
    location.pathname.endsWith(route.path)
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Back button at top left */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex">
          <Button variant="ghost">
            <ArrowLeft />
            {"Return to Home"}
          </Button>
        </Link>
      </div>

      {/* Mode Toggle at top right */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      {/* Main Content */}
      <main className="w-full max-w-[350px] mx-auto my-auto">
        <div className="text-2xl text-center mb-6">
          {currentRoute && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl font-semibold leading-8 tracking-normal">
                {currentRoute.label}
              </span>
              <span className="text-sm font-normal leading-5 tracking-normal text-muted-foreground">
                {currentRoute.subtitle}
              </span>
            </div>
          )}
        </div>
        <div>
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout;
