import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Access Denied";
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <ShieldX
          className="mx-auto h-16 w-16 text-destructive"
          aria-hidden="true"
        />
        <h1 className="mt-6 text-3xl font-extrabold text-primary">
          Access Denied
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sorry, you don't have permission to access this page. If you believe
          this is an error, please contact the administrator.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={handleGoBack}
            className="flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Go Back
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex items-center justify-center"
          >
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Go to Homepage
          </Button>
        </div>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        If you need assistance, please contact our support team.
      </p>
    </div>
  );
}
