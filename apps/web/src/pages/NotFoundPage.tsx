import { Link } from "react-router-dom";
import { Button } from "../components/ui";
import { AlertCircle } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="max-w-sm mx-auto text-center py-20 space-y-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100 mx-auto">
        <AlertCircle className="h-5 w-5 text-red-500" />
      </div>
      <div>
        <h3 className="heading text-xl text-fg">Page not found</h3>
        <p className="text-xs text-muted leading-relaxed mt-2 max-w-xs mx-auto">
          This route doesn't exist. Return to the dashboard or check your navigation link.
        </p>
      </div>
      <Button asChild className="text-xs h-9 px-5 rounded-xl shadow-soft">
        <Link to="/dashboard">Back to Overview</Link>
      </Button>
    </div>
  );
}
