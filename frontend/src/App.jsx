import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/AdminDashboard"
import InternDashboard from "./pages/InternDashboard"
import Interns from "./pages/Interns"
import Tasks from "./pages/Tasks"
import "./App.css"
import Progress from "./pages/Progress"
import Submissions from "./pages/Submissions"
import SubmitTask from "./pages/SubmitTask"
import Feedback from "./pages/Feedback"
import ProtectedRoute from "./components/ProtectedRoute"


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Login />} />

          <Route
            path="/register"
            element={<Register />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interns"
            element={<Interns />} />

          <Route
            path="/tasks"
            element={<Tasks />} />

          <Route
            path="/progress"
            element={<Progress />} />

          <Route
            path="/submissions"
            element={<Submissions />} />

          <Route
            path="/intern-dashboard"
            element={
              <ProtectedRoute allowedRole="intern">
                <InternDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submit-task"
            element={<SubmitTask />}
          />
          <Route
            path="/feedback"
            element={<Feedback />}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
