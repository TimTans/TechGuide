import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import Auth from "./pages/Auth";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/dashboard";

const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const url = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(url, apikey);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/auth"
            element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/auth" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;