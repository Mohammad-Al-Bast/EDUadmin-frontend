import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="h-dvh flex flex-col items-center justify-center space-y-4 px-4">
            <h1 className="text-2xl font-semibold">Welcome to the Home Page</h1>
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
            </div>
        </div>
    );
};

export default Home;
