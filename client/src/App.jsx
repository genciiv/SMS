import { BrowserRouter, Routes, Route } from "react-router-dom";

// Publike
import Login from "./pages/Login";
import Register from "./pages/Register";

// Të mbrojtura + layout
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Assignments from "./pages/Assignments";
import Grades from "./pages/Grades";
import Notifications from "./pages/Notifications";
import Calendar from "./pages/Calendar";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rrugë publike */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rrugë të mbrojtura me layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Layout>
                <Attendance />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Layout>
                <Assignments />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/grades"
          element={
            <ProtectedRoute>
              <Layout>
                <Grades />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Layout>
                <Calendar />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Layout>
                <Schedule />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 e thjeshtë */}
        <Route
          path="*"
          element={
            <div style={{ padding: 24 }}>
              <h1>404</h1>
              <p>Faqja nuk u gjet. <a href="/">Kthehu te kryefaqja</a></p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
