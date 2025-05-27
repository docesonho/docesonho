import { Toaster } from "@/components/ui/toaster";
import { Toaster as ReactHotToastToaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { useAdmin } from '@/hooks/useAdmin';
import { ensureProductsBucket } from '@/lib/supabase';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  useEffect(() => {
    // Garante que o bucket 'products' existe quando o app iniciar
    ensureProductsBucket().catch(console.error);
  }, []);

  return (
    <Router>
      <TooltipProvider>
        <StoreProvider>
          <ReactHotToastToaster
            position="bottom-left"
            toastOptions={{
              duration: 2500,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                padding: '16px',
                fontSize: '15px',
                lineHeight: '1.5',
                maxWidth: '400px',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: 'hsl(var(--primary))',
                  secondary: 'hsl(var(--primary-foreground))',
                },
              },
              error: {
                iconTheme: {
                  primary: 'hsl(var(--destructive))',
                  secondary: 'hsl(var(--primary-foreground))',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </StoreProvider>
      </TooltipProvider>
    </Router>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
