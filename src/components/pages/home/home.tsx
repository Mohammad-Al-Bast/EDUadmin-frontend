import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/login/use-auth";

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="h-dvh flex flex-col items-center justify-center space-y-4 px-4">
            <h1 className="text-2xl font-semibold">Welcome to{" "}
                <span className="font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
                    EDU Admin - Suite
                </span>
            </h1>
            <div className="flex gap-4">
                {!isAuthenticated ? (
                    <Link to="/auth/login">
                        <Button variant="default">Log In</Button>
                    </Link>
                ) : (
                    <Link to="/dashboard">
                        <Button 
                        variant="outline"
                        className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
                        >
                            Go to Dashboard
                        </Button>
                    </Link>
                )}
                <ModeToggle />
            </div>
        </div>
    );
};

export default Home;
