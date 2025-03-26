import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/auth-context";
import { BrowserRouter as Router } from "react-router-dom"; // Assuming this is used for routing

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          {/* Rest of your app components */}
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;