import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiHeart } from "react-icons/fi";
import "./Explorer.css";
import imagen from "../../../public/image.png";

const Explorer = () => {
  const [proyectos, setProyectos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ categoria: "" });
  const [orden, setOrden] = useState("recientes");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

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
            proyectosFiltrados.map((proyecto) => (
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
                        style={{ width: `0%` }}
                      ></div>
                    </div>
                    <div className="progress-stats">
                      <span>$0 recaudados</span>
                      <span>0%</span>
                    </div>
                  </div>

                  <button className="support-btn">
                    <FiHeart /> Apoyar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>No se encontraron proyectos</h3>
              <p>Intenta ajustar tus filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explorer;