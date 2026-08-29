import { Link } from "react-router-dom";
import { Button } from "../components/ui";
import { AlertCircle } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="max-w-sm mx-auto text-center py-24 space-y-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C0392B]/10 border border-[#C0392B]/25 mx-auto">
        <AlertCircle className="h-6 w-6 text-[#C0392B]" />
      </div>
      <div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
          className="text-2xl text-[#F2EDDE]">Page not found</h3>
        <p className="text-xs text-[#8A8475] leading-relaxed mt-2 max-w-xs mx-auto">
          This route doesn't exist. Return to the dashboard or check your navigation link.
        </p>
      </div>
      <Button asChild className="text-xs h-9 px-5 rounded-xl">
        <Link to="/dashboard">Back to Overview</Link>
      </Button>
    </div>
  );
}
