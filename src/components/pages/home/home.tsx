import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="h-dvh flex flex-col items-center justify-center space-y-4 px-4">
            <h1 className="text-2xl font-semibold">Welcome to{" "}
                <span className="font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
                    EDU Admin - Suite
                </span>
            </h1>
            <p className="text-muted-foreground text-center text-sm">
                {"This is the landing page of our application,"}
                <br />
                {"The website is under development."}
            </p>
            <div className="flex gap-4">
                <Link to="/auth/signin">
                    <Button variant="default">Sign In</Button>
                </Link>
                <Link to="/dashboard">
                    <Button variant="outline">Go to Dashboard</Button>
                </Link>
                <ModeToggle />
            </div>
        </div>
    );
};

export default Home;
