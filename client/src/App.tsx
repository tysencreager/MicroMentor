import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Landing from "@/components/Landing";
import MenteeHome from "@/components/MenteeHome";
import MentorHome from "@/components/MentorHome";
import MentorApplication from "@/components/MentorApplication";
import MentorVerificationDashboard from "@/components/MentorVerificationDashboard";
import ThemeToggle from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";

// TODO: Remove mock functionality - determine user role from backend
function getUserRole(user: any) {
  // For demo purposes, alternate between mentor and mentee based on email
  if (user?.email?.includes('mentor')) {
    return 'mentor';
  }
  return 'mentee';
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  // Handle unauthorized errors at page level
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Only show toast if we had a user before (logout scenario)
      const hadUser = localStorage.getItem('hadUser');
      if (hadUser) {
        toast({
          title: "Session expired",
          description: "Please log in again to continue.",
          variant: "destructive"
        });
        localStorage.removeItem('hadUser');
      }
    } else if (isAuthenticated && user) {
      localStorage.setItem('hadUser', 'true');
    }
  }, [isAuthenticated, isLoading, user, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto animate-pulse">
            <span className="text-primary-foreground font-bold">M</span>
          </div>
          <p className="text-muted-foreground">Loading MicroMentor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const userRole = getUserRole(user);

  return (
    <Switch>
      <Route path="/mentor/apply">
        <MentorApplication user={user} onLogout={handleLogout} />
      </Route>
      <Route path="/mentor/verification">
        <MentorVerificationDashboard user={user} onLogout={handleLogout} />
      </Route>
      <Route path="/">
        {userRole === 'mentor' ? (
          <MentorHome user={user} onLogout={handleLogout} />
        ) : (
          <MenteeHome user={user} onLogout={handleLogout} />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
