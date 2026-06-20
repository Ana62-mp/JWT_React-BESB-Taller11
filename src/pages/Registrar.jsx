import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

function Registrar() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("USER");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          rol,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo registrar el usuario");
      }

      await response.json();

      setMensaje("Usuario registrado correctamente. Redirigiendo al login...");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell auth-shell-register">
        <div className="auth-card register-card">
          <div className="auth-header">
            <span className="auth-kicker">Nuevo usuario</span>
            <h2>Crear cuenta</h2>
            <p>Registra un usuario para acceder al sistema protegido con JWT.</p>
          </div>

          <form onSubmit={manejarRegistro} className="auth-form">
            <div className="form-group">
              <label>Nombre de usuario</label>
              <input
                type="text"
                placeholder="Ej: ana_user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Mínimo 4 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Rol</label>
              <select value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {mensaje && <p className="mensaje-exito">{mensaje}</p>}
            {error && <p className="mensaje-error">{error}</p>}

            <button type="submit" className="btn-primary btn-full">
              Registrar usuario
            </button>
          </form>

          <p className="texto-registro">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>

        <div className="auth-panel auth-panel-soft">
          <span className="auth-badge">ROLE CONTROL</span>
          <h1>Usuarios con acceso controlado</h1>
          <p>
            El rol asignado viajará con el token para validar permisos dentro del
            sistema.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Registrar;