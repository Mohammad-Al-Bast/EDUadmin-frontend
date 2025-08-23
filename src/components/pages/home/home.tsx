import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/login/use-auth";
import { LayoutDashboard, LogIn } from "lucide-react";

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="h-dvh flex flex-col items-center justify-center space-y-4 px-4">
            {/* Mode Toggle at top right */}
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>
            <div className="size-36">
                <img src="/images/liu.png"/>
            </div>
            <h1 className="text-2xl font-semibold">Welcome to{" "}
                <span className="font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
                    EDU Admin - Suite
                </span>
            </h1>
            <div className="flex gap-4">
                {!isAuthenticated ? (
                    <Link to="/auth/login">
                        <Button 
                        variant="default"
                        className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:text-white hover:from-green-600 hover:to-blue-600 transition-colors duration-500"
                        >
                            <LogIn/>
                            Log In
                        </Button>
                    </Link>
                ) : (
                    <Link to="/dashboard">
                        <Button 
                        variant="outline"
                        className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:text-white hover:from-blue-600 hover:to-green-600 transition-colors duration-500"
                        >
                            <LayoutDashboard/>
                            Go to Dashboard
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Home;
