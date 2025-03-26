import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AdminPage from "@/pages/admin-page";
import ProjectDetailPage from "@/pages/project-detail-page";
import BlogDetailPage from "@/pages/blog-detail-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/projects/:id" component={ProjectDetailPage} />
      <Route path="/blog/:id" component={BlogDetailPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
