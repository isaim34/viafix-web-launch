
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    const path = location.pathname.toLowerCase();
    
    // Handle mechanic dashboard routes
    if (path.includes('mechanic') && path.includes('dashboard')) {
      console.log("Redirecting to correct mechanic dashboard route");
      navigate('/mechanic-dashboard', { replace: true });
      return;
    }
    
    // Handle message routes
    if (path.includes('message') || path.includes('inbox') || path.includes('chat')) {
      console.log("Redirecting to messages page");
      navigate('/messages', { replace: true });
      return;
    }
    
    // Handle how it works variations
    if (path.includes('how') && path.includes('work')) {
      console.log("Redirecting to correct how it works route");
      navigate('/how-it-works', { replace: true });
      return;
    }
    
    // Handle different casing or missing hyphens in routes
    const routeMap = {
      '/howitworks': '/how-it-works',
      '/how_it_works': '/how-it-works',
      '/mechanicdashboard': '/mechanic-dashboard',
      '/mechanic_dashboard': '/mechanic-dashboard',
      '/vehicle-safety': '/vehicle-safety-check',
      '/vehiclesafetycheck': '/vehicle-safety-check',
      '/inbox': '/messages',
      '/chat': '/messages'
    };
    
    // Check for potential matches removing special characters
    const normalizedPath = path.replace(/[-_]/g, '');
    
    for (const [incorrectPath, correctPath] of Object.entries(routeMap)) {
      const normalizedIncorrect = incorrectPath.replace(/[-_]/g, '').toLowerCase();
      
      if (normalizedPath === normalizedIncorrect) {
        console.log(`Redirecting from ${path} to correct route: ${correctPath}`);
        navigate(correctPath, { replace: true });
        return;
      }
    }
    
  }, [location.pathname, navigate]);

  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500 mb-8">
            The URL <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code> could not be found.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" className="flex items-center gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleGoBack}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
