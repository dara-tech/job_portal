import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme";
import { setAuthToken } from "@/redux/authSlice";
import Footer from "./components/shared/Footer";
import Navbar from "./components/shared/Navbar";
import AdminLayout from "./components/shared/AdminLayout";
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
import PostJob from "./components/admin/form/postjob/PostJob";
import Applicants from "./components/admin/Applicants";
import UpdateJob from "./components/admin/UpdateJob";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import SavedJobs from "./components/SavedJob";
import UserTable from "./components/sadmin/UserTable";
import UserView from "./components/sadmin/UserView";
import ChatTable from "./components/admin/ChatTable";
import "./App.css";

const AppLayout = () => {
  const { user } = useSelector((store) => store.auth);

  if (user && (user.role === 'recruiter' || user.role === 'admin')) {
    return <AdminLayout />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer className="flex justify-end sticky" />
    </div>
  );
};

const routes = [
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/jobs", element: <Jobs /> },
      { path: "/browse", element: <Browse /> },
      { path: "/saved", element: <SavedJobs /> },
      { path: "/profile", element: <Profile /> },
      { path: "/description/:id", element: <JobDescription /> },
      { 
        path: "/admin",
        element: <ProtectedRoute />,
        children: [
          { path: "companies", element: <Companies /> },
          { path: "companies/create", element: <CompanyCreate /> },
          { path: "companies/:id", element: <CompanySetup /> },
          { path: "jobs", element: <AdminJobs /> },
          { path: "job/create", element: <PostJob /> },
          { path: "jobs/:id/applicants", element: <Applicants /> },
          { path: "job/update/:id", element: <UpdateJob /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "user", element: <UserTable /> },
          { path: "user/:id", element: <UserView /> },
          { path: "chat", element: <ChatTable /> },
        ],
      },
    ],
  },
];

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(setAuthToken(token));
    }
  }, [dispatch]);

  const appRouter = createBrowserRouter(routes);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  );
}

export default App;