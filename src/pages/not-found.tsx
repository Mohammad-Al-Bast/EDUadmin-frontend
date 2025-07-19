import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const notFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-dvh space-y-2">
            <h1>404 - Page Not Found</h1>
            <Link to="/">
                <Button>
                    Go back to Home
                </Button>
            </Link>
        </div>
    )
}

export default notFound;