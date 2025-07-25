import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext"; // Add this import

// Pages
import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminDocs from "./pages/Admin/AdminDocuments";
import StudentLabsPortal from "./pages/Student/StudentLabsPortal";
import StudentDocsPortal from "./pages/Student/StudentDocsPortal";
import Semesters from "./pages/Semesters";
import SemesterImages from "./pages/SemesterImages";
import About from "./pages/About"; // Add this import

// Create a separate component for the routes
function AppRoutes() {
  const { isAdmin, loading } = useAuth(); // Get auth state from context

  // 🔐 Protects admin routes
  const PrivateRoute = ({ element }) => {
    if (loading) return <div>Loading...</div>; // Optional loading state
    return isAdmin ? element : <Navigate to="/admin/login" />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/student" element={<StudentLabsPortal />} />
      <Route path="/student/docs" element={<StudentDocsPortal />} />
      <Route path="/semesters" element={<Semesters />} />
      <Route path="/semester/:semNumber" element={<SemesterImages />} />
      <Route path="/about" element={<About />} />

      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/home"
        element={<PrivateRoute element={<AdminHome />} />}
      />
      <Route
        path="/admin/dashboard"
        element={<PrivateRoute element={<AdminDashboard />} />}
      />
      <Route
        path="/admin/docs"
        element={<PrivateRoute element={<AdminDocs />} />}
      />

      {/* Fallback for unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Toaster 
            position="top-right" 
            toastOptions={{
              // Light mode styles
              style: {
                background: '#FFFFFF',
                color: '#111827',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              },
              // Dark mode styles
              className: 'dark:bg-surface-800 dark:text-surface-100 dark:shadow-dark-soft',
              duration: 4000,
            }}
          />
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;