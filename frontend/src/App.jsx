import React from "react";
import { ThemeProvider } from "@/components/theme";
import "./App.css";
import Footer from "./components/shared/Footer";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies"; // Corrected import
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import UpdateJob from "./components/admin/UpdateJob";
import ProtectedRoute from "./components/admin/ProtectedRoute";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/jobs",
      element: <Jobs />,
    },
    {
      path: "/browse",
      element: <Browse />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/description/:id",
      element: <JobDescription />,
    },
    // Admin
    {
      path:"/admin/companies",
      element: <ProtectedRoute><Companies/></ProtectedRoute>
    },
    {
      path:"/admin/companies/create",
      element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
    },
    {
      path:"/admin/companies/:id",
      element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
    },
    {
      path:"/admin/jobs",
      element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
    },
    {
      path: "/admin/job/create",
      element: <ProtectedRoute><PostJob/></ProtectedRoute>
    },
    
    {
      path:"/admin/jobs/:id/applicants",
      element:<ProtectedRoute><Applicants/></ProtectedRoute> 
    },
    {
      path: "/admin/job/update/:id",
      element:<ProtectedRoute><UpdateJob/></ProtectedRoute> , // Using the default import
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen">
        <RouterProvider router={appRouter} />
        <div className="flex-grow" />
        <Footer className="flex justify-end sticky" />
      </div>
    </ThemeProvider>
  );
}

export default App;
