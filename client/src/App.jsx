import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

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

function App() {
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    function getCookie(name) {
      const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      return match ? match[2] : null;
    }

    if (getCookie("token")) {
      setIsAdmin(true);
    }
  }, []);

  // 🔐 Protects admin routes
  const PrivateRoute = ({ element }) => {
    return isAdmin ? element : <Navigate to="/admin/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<StudentLabsPortal />} />
        <Route path="/student/docs" element={<StudentDocsPortal />} />
        <Route path="/semesters" element={<Semesters />} />
        <Route path="/semester/:semNumber" element={<SemesterImages />} />

        {/* Admin Login Route */}
        <Route
          path="/admin/login"
          element={<AdminLogin setIsAdmin={setIsAdmin} />}
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/home"
          element={
            <PrivateRoute element={<AdminHome setIsAdmin={setIsAdmin} />} />
          }
        />
        <Route
          path="/admin/dashboard"
          element={<PrivateRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/admin/docs"
          element={<PrivateRoute element={<AdminDocs />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
