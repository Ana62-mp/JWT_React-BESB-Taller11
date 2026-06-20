import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      const datos = await response.json();

      login(datos.token);
      navigate("/perfil");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-panel auth-panel-info">
          <span className="auth-badge">JWT ACCESS</span>

          <h1>Bienvenido al sistema protegido</h1>

          <p>
            Inicia sesión para validar tu token y acceder a tu perfil de usuario.
          </p>

          <div className="auth-code-box">
            <span>Authorization</span>
            <strong>Bearer token</strong>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-kicker">Acceso seguro</span>
            <h2>Inicio de sesión</h2>
            <p>Ingresa tus credenciales para continuar.</p>
          </div>

          <form onSubmit={manejarSubmit} className="auth-form">
            <div className="form-group">
              <label>Usuario</label>
              <input
                type="text"
                placeholder="Ej: ana_admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Escribe tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {err && <p className="mensaje-error">{err}</p>}

            <div className="button-group">
              <button type="submit" className="btn-primary">
                Ingresar
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/registrar")}
              >
                Crear cuenta
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;