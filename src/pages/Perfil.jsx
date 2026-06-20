import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

function Perfil() {
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [error, setError] = useState("");

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar el perfil. Inicie sesión nuevamente.");
        }

        const datos = await response.json();
        setDatosPerfil(datos);
      } catch (err) {
        setError(err.message);
      }
    };

    cargarPerfil();
  }, [token]);

  const manejarLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log("Error de red al intentar revocar el token:", err.message);
    }

    logout();
    navigate("/login");
  };

  return (
    <main className="profile-page">
      <section className="profile-shell">
        <div className="profile-hero">
          <span className="auth-badge">TOKEN ACTIVO</span>

          <h1>Perfil verificado</h1>

          <p>
            Esta pantalla solo se muestra cuando el backend reconoce el token JWT
            enviado en la cabecera Authorization.
          </p>

          <button className="btn-logout" onClick={manejarLogout}>
            Cerrar sesión
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <span className="auth-kicker">Datos recibidos</span>
            <h2>Información del usuario</h2>
          </div>

          {error && <p className="mensaje-error">{error}</p>}

          {datosPerfil ? (
            <div className="profile-data">
              <div className="profile-row">
                <span>Mensaje</span>
                <strong>{datosPerfil.Mensaje}</strong>
              </div>

              <div className="profile-row">
                <span>Usuario</span>
                <strong>{datosPerfil.Usuario}</strong>
              </div>

              <div className="profile-row">
                <span>Rol</span>
                <strong>{datosPerfil.Rol}</strong>
              </div>

              <div className="profile-row">
                <span>Estatus</span>
                <strong>{datosPerfil.Estatus}</strong>
              </div>
            </div>
          ) : (
            <p className="loading-text">Cargando información del perfil...</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Perfil;