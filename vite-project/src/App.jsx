import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter, Route, Routes ,Navigate } from "react-router-dom";
import Gallery from './pages/Gallery'
import Login from './pages/Login'
import './index.css'
import './App.css'
function App() {
  const {isAuthenticated} = useAuth0();
  return (
    <BrowserRouter>
    <Routes>
    <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/gallery" /> : <Login />}
        />
        <Route path="/gallery" element={<Gallery />} />
    </Routes>
   
  </BrowserRouter>
  )
}

export default App
