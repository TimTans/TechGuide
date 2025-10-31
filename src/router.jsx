import { createBrowserRouter } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/dashboard";
import AllCourses from "./pages/AllCourses";
import ConfirmPage from "./pages/confirmpage";
import App from "./App";


export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/signin", element: <SignInPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/confirm", element: <ConfirmPage /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/allcourses", element: <AllCourses /> }
])