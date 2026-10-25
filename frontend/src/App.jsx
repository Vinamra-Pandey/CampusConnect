import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Internships from "./pages/Internships";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import InternshipDetails from "./pages/InternshipDetails";
import MyApplications from "./pages/MyApplications";

import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";
import "./styles/admin.css";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/internships"
          element={<Internships />}
        />

        <Route
          path="/internships/:id"
          element={<InternshipDetails />}
        />

        <Route
          path="/applications"
          element={<MyApplications />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;