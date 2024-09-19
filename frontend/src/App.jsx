import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthToken } from "@/redux/authSlice";
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
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import UpdateJob from "./components/admin/UpdateJob";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Dashbaord from "./components/Dashbaord";

function App() {
  const dispatch = useDispatch();

  // Load token from localStorage on app initialization
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(setAuthToken(token)); // Set the token in Redux when app initializes
    }
  }, [dispatch]);

  const appRouter = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/jobs", element: <Jobs /> },
    { path: "/browse", element: <Browse /> },
    { path: "/profile", element: <Profile /> },
    { path: "/description/:id", element: <JobDescription /> },
    // Admin routes
    {
      path: "/admin/companies",
      element: (
        <ProtectedRoute>
          <Companies />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/companies/create",
      element: (
        <ProtectedRoute>
          <CompanyCreate />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/companies/:id",
      element: (
        <ProtectedRoute>
          <CompanySetup />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/jobs",
      element: (
        <ProtectedRoute>
          <AdminJobs />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/job/create",
      element: (
        <ProtectedRoute>
          <PostJob />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/jobs/:id/applicants",
      element: (
        <ProtectedRoute>
          <Applicants />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/job/update/:id",
      element: (
        <ProtectedRoute>
          <UpdateJob />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/dashboard",
      element: (
        <ProtectedRoute>
          <Dashbaord/>
        </ProtectedRoute>
      ),
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
