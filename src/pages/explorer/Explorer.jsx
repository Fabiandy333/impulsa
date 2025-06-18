import React, { useState, useEffect, use } from "react";
import { FiSearch, FiFilter, FiHeart } from "react-icons/fi";
import "./Explorer.css";
import imagen from "../../../public/image.png";
import axios from "axios";
import useAuth from "../auth/use-auth";

const Explorer = () => {
  const [proyectos, setProyectos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ categoria: "" });
  const [orden, setOrden] = useState("recientes");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [monto, setMonto] = useState("");
  const [anonima, setAnonima] = useState(false);
  const [metodosPago, setMetodosPago] = useState([]);
  const [idMetodoPago, setIdMetodoPago] = useState("");
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const {userLooged} = useAuth();
  const formatearMonto = (valor) => {
    const limpio = valor.replace(/\D/g, ""); // quita todo lo que no sea número
    const numero = parseInt(limpio, 10);
    if (isNaN(numero)) return "";
    return numero.toLocaleString("es-CO"); // añade puntos
  };

  const desformatearMonto = (valor) => {
    return valor.replace(/\./g, ""); // quita puntos
  };



  const handleApoyar = async () => {
    if (!monto || !idMetodoPago) {
      alert("Por favor ingresa un monto y selecciona un método de pago.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:43674/api/contribucion", {
        monto,
        anonima,
        idUsuario: userLooged.idusuario,
        idProyecto: proyectoSeleccionado.idproyecto,
        idMetodoPago,
      });

      setMostrarModal(false);
      const correoUsuario = userLooged?.email || userLooged?.correo || "correo no disponible";
      setMensajeConfirmacion(`🎉 Gracias ${userLooged.nombre} por tu colaboración de $${monto} al proyecto "${proyectoSeleccionado.titulo}". Se enviará un correo con el desprendible de pago a ${correoUsuario}.`);
    } catch (error) {
      console.error("❌ Error al enviar contribución:", error);
    }
  };


  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const res = await fetch("http://localhost:43674/api/proyecto");
        const data = await res.json();
        setProyectos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error al cargar proyectos:", error);
      }
    };

    const obtenerCategorias = async () => {
      try {
        const res = await fetch("http://localhost:43674/api/categorias");
        const data = await res.json();
        setCategorias(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error al cargar categorías:", error);
      }
    };

    const obtenerMetodosPago = async () => {
      try {
        const res = await fetch('http://localhost:43674/api/metodos-pago');
        const data = await res.json();
        setMetodosPago(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error al obtener métodos de pago:", error);
      }
    };

    obtenerMetodosPago();
    obtenerProyectos();
    obtenerCategorias();
  }, []);

  const proyectosFiltrados = proyectos
    .filter((proyecto) => {
      const coincideBusqueda = proyecto.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        proyecto.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = !filtros.categoria || proyecto.nombrecategoria === filtros.categoria;
      return coincideBusqueda && coincideCategoria;
    })
    .sort((a, b) => {
      if (orden === "recientes") {
        return new Date(b.fechacreacion) - new Date(a.fechacreacion);
      } else if (orden === "populares") {
        return (b.recaudado || 0) - (a.recaudado || 0);
      }
      return 0;
    });

  return (
    <>
    <div className="explorer-container">
      <div className="search-section">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            className="filter-btn"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <FiFilter /> Filtros
          </button>
        </div>

        {mostrarFiltros && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Categoría</label>
              <select
                value={filtros.categoria}
                onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
              >
                <option value="">Todas</option>
                {categorias.map((cat) => (
                  <option key={cat.idcategoria} value={cat.nombrecategoria}>{cat.nombrecategoria}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="results-header">
        <h2>{proyectosFiltrados.length} Proyectos encontrados</h2>
        <div className="sort-options">
          <span>Ordenar por:</span>
          <select value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="recientes">Más recientes</option>
            <option value="populares">Más apoyados</option>
          </select>
        </div>
      </div>

      <div className="proyectos-feed-container">
        <div className="projects-grid">
          {proyectosFiltrados.length > 0 ? (
            proyectosFiltrados.map((proyecto) => {
              const porcentaje = Math.min(
                Math.round((proyecto.recaudado / proyecto.montometa) * 100),
                100
              );

              return (
                <div key={proyecto.idproyecto} className={`project-card ${proyecto.destacado ? "featured" : ""}`}>
                  {proyecto.destacado && <span className="featured-badge">Destacado</span>}
                  <img src={imagen} alt={proyecto.titulo} />

                  <div className="project-info">
                    <div className="project-meta">
                      <span className="category">{proyecto.nombrecategoria}</span>
                      <span className="creator">Creado por: {proyecto.creador}</span>
                    </div>

                    <h3>{proyecto.titulo}</h3>
                    <p className="description">{proyecto.descripcion}</p>

                    <div className="progress-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                      </div>
                      <div className="progress-stats">
                        <span>${new Intl.NumberFormat('es-CO').format(proyecto.recaudado)} / 
                          ${new Intl.NumberFormat('es-CO').format(proyecto.montometa)}</span>
                        <span>{porcentaje}%</span>
                      </div>
                    </div>

                    <button className="support-btn" onClick={() => {
                      setProyectoSeleccionado(proyecto);
                      setMostrarModal(true);
                    }}>
                      <FiHeart /> Apoyar
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <h3>No se encontraron proyectos</h3>
              <p>Intenta ajustar tus filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
    {mostrarModal && (
      <div className="modal-overlay">
        <div className="modal-apoyo">
          <button className="cerrar-modal" onClick={() => setMostrarModal(false)}>×</button>
          <h3>Apoyar este proyecto</h3>
            <input
              type="text"
              placeholder="Monto a donar"
              value={formatearMonto(monto)}
              onChange={(e) => setMonto(desformatearMonto(e.target.value))}
            />

            <label>Método de pago:</label>
            <select value={idMetodoPago} onChange={(e) => setIdMetodoPago(e.target.value)}>
              <option value="">Seleccionar</option>
              {metodosPago.map((m) => (
                <option key={m.idmetodopago} value={m.idmetodopago}>{m.nombremetodo}</option>
              ))}
            </select>

            <div className="anonima-checkbox">
              <input
                type="checkbox"
                checked={anonima}
                onChange={(e) => setAnonima(e.target.checked)}
              />
              Apoyar de forma anónima
            </div>

          <button onClick={handleApoyar}>Confirmar Apoyo</button>
        </div>
      </div>
    )}
    {mensajeConfirmacion && (
      <div className="mensaje-confirmacion">
        <p>{mensajeConfirmacion}</p>
        <button
        onClick={() => setMensajeConfirmacion("")}
        style={{
          all: "unset",
          fontWeight: "bold",
          fontSize: "1.2rem",
          cursor: "pointer",
          marginLeft: "auto",
        }}
      >
        ×
      </button>
      </div>
    )}

   </>
  )
};

export default Explorer;