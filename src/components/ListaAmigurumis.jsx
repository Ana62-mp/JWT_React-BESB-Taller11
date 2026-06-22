import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";

function ListaAmigurumis({ amigurumis, cargarAmigurumis }) {
  const [fotosUrl, setFotosUrl] = useState({});
  const [amigurumiEditando, setAmigurumiEditando] = useState(null);

  const [nombreEdit, setNombreEdit] = useState("");
  const [tipoEdit, setTipoEdit] = useState("");
  const [descripcionEdit, setDescripcionEdit] = useState("");
  const [tiempoEdit, setTiempoEdit] = useState("");
  const [nivelEdit, setNivelEdit] = useState("");
  const [archivoEdit, setArchivoEdit] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { token } = useAuth();

  useEffect(() => {
    const urlsCreadas = [];

    const descargarFotos = async () => {
      for (const amigurumi of amigurumis) {
        try {
          const res = await fetch(
            `${API_BASE_URL}/auth/amigurumis/${amigurumi.id}/foto`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const blob = await res.blob();
            const urlLocal = URL.createObjectURL(blob);

            urlsCreadas.push(urlLocal);

            setFotosUrl((prev) => ({
              ...prev,
              [amigurumi.id]: urlLocal,
            }));
          }
        } catch (error) {
          console.log("Fallo al descargar la foto: " + error);
        }
      }
    };

    if (amigurumis.length > 0 && token) {
      descargarFotos();
    }

    return () => {
      for (const url of urlsCreadas) {
        URL.revokeObjectURL(url);
      }
    };
  }, [amigurumis, token]);

  const eliminarAmigurumi = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este amigurumi?");

    if (!confirmar) {
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/amigurumis/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const textoError = await response.text();
        throw new Error(`No se pudo eliminar. Status: ${response.status}. Error: ${textoError}`);
      }

      setSuccessMsg("Amigurumi eliminado correctamente");
      cargarAmigurumis();

    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const abrirFormularioEdicion = (amigurumi) => {
    setAmigurumiEditando(amigurumi);
    setNombreEdit(amigurumi.nombre);
    setTipoEdit(amigurumi.tipo);
    setDescripcionEdit(amigurumi.descripcion);
    setTiempoEdit(amigurumi.tiempoElaboracion);
    setNivelEdit(amigurumi.nivelDificultad);
    setArchivoEdit(null);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const cerrarFormularioEdicion = () => {
    setAmigurumiEditando(null);
    setArchivoEdit(null);
  };

  const manejarArchivoEdit = (e) => {
    setArchivoEdit(e.target.files[0]);
  };

  const guardarCambios = async (e) => {
    e.preventDefault();

    if (!amigurumiEditando) {
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();

    formData.append("nombre", nombreEdit);
    formData.append("tipo", tipoEdit);
    formData.append("descripcion", descripcionEdit);
    formData.append("tiempoElaboracion", tiempoEdit);
    formData.append("nivelDificultad", nivelEdit);

    if (archivoEdit) {
      formData.append("file", archivoEdit);
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/amigurumis/${amigurumiEditando.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const textoError = await response.text();
        throw new Error(`No se pudo editar. Status: ${response.status}. Error: ${textoError}`);
      }

      setSuccessMsg("Amigurumi actualizado correctamente");
      cerrarFormularioEdicion();
      cargarAmigurumis();

    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="amigurumis-lista">
      <h2 className="amigurumis-subtitulo">Amigurumis Registrados</h2>

      {errorMsg && <p className="mensaje-error">{errorMsg}</p>}
      {successMsg && <p className="mensaje-exito">{successMsg}</p>}

      {amigurumis.length === 0 ? (
        <p className="texto-vacio">No hay amigurumis registrados por el momento.</p>
      ) : (
        <div className="amigurumis-grid">
          {amigurumis.map((a) => (
            <div className="amigurumi-card" key={a.id}>
              <div className="amigurumi-img-contenedor">
                {fotosUrl[a.id] ? (
                  <img
                    src={fotosUrl[a.id]}
                    alt={`Foto de ${a.nombre}`}
                    className="amigurumi-img"
                  />
                ) : (
                  <div className="amigurumi-img-placeholder">
                    Sin foto
                  </div>
                )}
              </div>

              <div className="amigurumi-info">
                <h3>{a.nombre}</h3>
                <p><strong>Tipo:</strong> {a.tipo}</p>
                <p><strong>Descripción:</strong> {a.descripcion}</p>
                <p><strong>Tiempo:</strong> {a.tiempoElaboracion}</p>
                <p><strong>Dificultad:</strong> {a.nivelDificultad}</p>
                <p className="mime-texto"><strong>Archivo:</strong> {a.mimeType}</p>
              </div>

              <div className="amigurumi-acciones">
                <button
                  className="btn-editar"
                  onClick={() => abrirFormularioEdicion(a)}
                >
                  Editar
                </button>

                <button
                  className="btn-eliminar"
                  onClick={() => eliminarAmigurumi(a.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {amigurumiEditando && (
        <div className="modal-fondo">
          <div className="modal-contenido">
            <h2>Editar Amigurumi</h2>

            <form onSubmit={guardarCambios} className="formulario-edicion">
              <div>
                <label>Nombre:</label>
                <input
                  type="text"
                  value={nombreEdit}
                  onChange={(e) => setNombreEdit(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Tipo:</label>
                <input
                  type="text"
                  value={tipoEdit}
                  onChange={(e) => setTipoEdit(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Descripción:</label>
                <textarea
                  value={descripcionEdit}
                  onChange={(e) => setDescripcionEdit(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Tiempo de elaboración:</label>
                <input
                  type="text"
                  value={tiempoEdit}
                  onChange={(e) => setTiempoEdit(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Nivel de dificultad:</label>
                <select
                  value={nivelEdit}
                  onChange={(e) => setNivelEdit(e.target.value)}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Medio">Medio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              <div>
                <label>Nueva foto opcional:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={manejarArchivoEdit}
                />
              </div>

              <div className="modal-botones">
                <button type="submit" className="btn-guardar">
                  Guardar cambios
                </button>

                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarFormularioEdicion}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaAmigurumis;