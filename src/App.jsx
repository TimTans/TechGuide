import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";

const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const url = import.meta.env.VITE_SUPABASE_URL;

const supabase = createClient(url, apikey);

function App() {
  const [instruments, setInstruments] = useState([]);


  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const { data } = await supabase.from("users").select('*');
    console.log(data)
    setInstruments(data);
  }


  return (

    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route index path="/signin" element={<SignInPage />} />
          <Route index path="/signup" element={<SignUpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;