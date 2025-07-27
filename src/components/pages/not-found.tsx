import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Ghost, House } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col items-center justify-center h-dvh text-center px-4 space-y-6">
            <Ghost className="w-16 h-16 text-destructive animate-bounce" />
            <div>
                <h1 className="text-4xl font-bold">Oops! 404</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    {"We couldn't find the page you were looking for."}
                </p>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={handleGoBack}
                >
                    <ArrowLeft />
                    {"Go back"}
                </Button>
                <Link to="/">
                    <Button variant="default">
                        <House />
                        {"Go to Home"}
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
