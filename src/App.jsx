import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import Perfil from "./pages/Perfil";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";
import Vehiculos from "./pages/Vehiculos";
import GestionAmigurumis from "./pages/GestionAmigurumis";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/vehiculos" element={<Vehiculos />} />
            <Route path="/amigurumis" element={<GestionAmigurumis />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;