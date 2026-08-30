import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/AdminDashboard"
import InternDashboard from "./pages/InternDashboard"

 

function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route 
        path="/"
        element={ <Login/>}/> 

       <Route
       path="/register"
       element={<Register/>}/> 

       <Route
        path="/admin-dashboard"
        element={ <AdminDashboard/>}/>
       <Route
        path="/intern-dashboard"
        element={<InternDashboard />}/> 
    </Routes>
    </BrowserRouter>
          </>
  )
}

export default App
