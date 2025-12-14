
import { createBrowserRouter } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/dashboard";
import AllCourses from "./pages/AllCourses";
import ConfirmPage from "./pages/confirmpage";
import Settings from "./pages/settings";
import UserProfile from "./pages/userprofile";
import About from "./pages/about";
import Tutorials from "./pages/tutorials";
import TutorialDetail from "./pages/TutorialDetail";
import Safety from "./pages/safety";
import IRSPhoneScam from "./pages/IRSphonescam";

import InstructorDashboard from "./pages/InstructorDashboard";
import AllStudents from "./pages/AllStudents";
import Support from "./pages/SupportPage";
import AdminSignUpPage from "./pages/adminsignup";
import App from "./App";
import FakeTech from "./pages/Faketech";
import EmailPasswordResetScams from "./pages/emailresetscam";
import Community from "./pages/Community";



export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/signin", element: <SignInPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/adminsignup", element: <AdminSignUpPage /> },
    { path: "/confirm", element: <ConfirmPage /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/allcourses", element: <AllCourses /> },
    { path: "/settings", element: <Settings /> },
    { path: "/userprofile", element: <UserProfile /> },
    { path: "/about", element: <About /> },
    { path: "/safety", element: <Safety /> },
    { path: "/safety/IRSscam", element: <IRSPhoneScam /> },
    { path: "/safety/faketech", element: <FakeTech /> },
    { path: "/safety/emailreset-scams", element: <EmailPasswordResetScams /> },
    { path: "/community", element: <Community /> },


    

    // { path: "/support", element: <Support /> },
    { path: "/instructor", element: <InstructorDashboard /> },
    { path: "/allstudents", element: <AllStudents /> },
    { path: "/tutorials", element: <Tutorials /> },
    { path: "/tutorials/:id", element: <TutorialDetail /> },
    { path: "/safety", element: <Safety /> },
    { path: "/support", element: <Support /> }

])