import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";
import ListaAmigurumis from "../components/ListaAmigurumis";
import "../styles/amigurumis.css";

function GestionAmigurumis() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tiempoElaboracion, setTiempoElaboracion] = useState("");
  const [nivelDificultad, setNivelDificultad] = useState("");
  const [archivo, setArchivo] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [listaAmigurumis, setListaAmigurumis] = useState([]);

  const cargarAmigurumis = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/amigurumis`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de amigurumis");
      }

      const datos = await response.json();
      setListaAmigurumis(datos);

    } catch (error) {
      setErrorMsg(error.message);
    }
  }, [token]);

  useEffect(() => {
    cargarAmigurumis();
  }, [cargarAmigurumis]);

  const manejarArchivo = (e) => {
    setArchivo(e.target.files[0]);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    if (!archivo) {
      setErrorMsg("Debe seleccionar una foto del amigurumi");
      return;
    }
    

    const formData = new FormData();

    formData.append("file", archivo);
    formData.append("nombre", nombre);
    formData.append("tipo", tipo);
    formData.append("descripcion", descripcion);
    formData.append("tiempoElaboracion", tiempoElaboracion);
    formData.append("nivelDificultad", nivelDificultad);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/amigurumis/registrar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const textoError = await response.text();
        throw new Error(`No se pudo registrar el amigurumi. Status: ${response.status}. Error: ${textoError}`);
      }

      setSuccessMsg("Amigurumi registrado con éxito");

      setNombre("");
      setTipo("");
      setDescripcion("");
      setTiempoElaboracion("");
      setNivelDificultad("");
      setArchivo(null);

      cargarAmigurumis();

    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="gestion-amigurumis">
      <button
        className="btn-volver"
        onClick={() => navigate("/perfil")}
      >
        Volver al Perfil
      </button>

      <header className="amigurumis-header">
        <h1>Galería de Amigurumis</h1>
        <p>
          Registra tus amigurumis favoritos con foto, descripción, tiempo de elaboración y nivel de dificultad.
        </p>
      </header>

      <section className="formulario-contenedor">
        <h2>Registrar nuevo Amigurumi</h2>

        <form onSubmit={manejarSubmit} className="formulario-amigurumi">
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Conejito pastel"
              required
            />
          </div>

          <div>
            <label>Tipo:</label>
            <input
              type="text"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              placeholder="Ej: Animal, persona, personaje, comida"
              required
            />
          </div>

          <div>
            <label>Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe los colores, materiales o detalles del amigurumi"
              required
            />
          </div>

          <div>
            <label>Tiempo de elaboración:</label>
            <input
              type="text"
              value={tiempoElaboracion}
              onChange={(e) => setTiempoElaboracion(e.target.value)}
              placeholder="Ej: 4 horas, 2 días, 1 semana"
              required
            />
          </div>

          <div>
            <label>Nivel de dificultad:</label>
            <select
              value={nivelDificultad}
              onChange={(e) => setNivelDificultad(e.target.value)}
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="Fácil">Fácil</option>
              <option value="Medio">Medio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          <div>
            <label>Foto:</label>
            <input
              type="file"
              accept="image/*"
              onChange={manejarArchivo}
            />
          </div>

          <button type="submit" className="btn-registrar">
            Registrar Amigurumi
          </button>
        </form>

        {errorMsg && <p className="mensaje-error">{errorMsg}</p>}
        {successMsg && <p className="mensaje-exito">{successMsg}</p>}
      </section>

      <ListaAmigurumis
        amigurumis={listaAmigurumis}
        cargarAmigurumis={cargarAmigurumis}
      />
    </div>
  );
}

export default GestionAmigurumis;