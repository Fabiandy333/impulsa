import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiHeart, FiMapPin } from "react-icons/fi";
import "./Explorer.css";


const proyectosEjemplo = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  titulo: ["App Ecológica", "Documental Social", "Libro Infantil", "Tecnología Accesible"][i % 4],
  creador: `Creador ${i + 1}`,
  descripcion: "Descripción breve del proyecto y su impacto social o innovación tecnológica.",
  categoria: ["Tecnología", "Arte", "Educación", "Social"][i % 4],
  ubicacion: ["Bogotá", "Medellín", "Cali", "Barranquilla"][i % 4],
  meta: 5000 + (i * 1000),
  recaudado: 2000 + (i * 500),
  fechaCierre: `2025-${12 - (i % 6)}-${15 + (i % 10)}`,
  imagen: `https://source.unsplash.com/random/600x400/?project,${i}`,
  destacado: i % 3 === 0,
}));

const Explorer = () => {
  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    categoria: "",
    ubicacion: "",
    estado: "",
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setProyectos(proyectosEjemplo);
    }, 800);
  }, []);

  // Filtrar proyectos
  const proyectosFiltrados = proyectos.filter((proyecto) => {
    const coincideBusqueda = proyecto.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
                           proyecto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = !filtros.categoria || proyecto.categoria === filtros.categoria;
    const coincideUbicacion = !filtros.ubicacion || proyecto.ubicacion === filtros.ubicacion;
    
    return coincideBusqueda && coincideCategoria && coincideUbicacion;
  });

  return (
    <div className="explorer-container">
      {/* Barra de búsqueda y filtros */}
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
                onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
              >
                <option value="">Todas</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Arte">Arte</option>
                <option value="Educación">Educación</option>
                <option value="Social">Social</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Ubicación</label>
              <select
                value={filtros.ubicacion}
                onChange={(e) => setFiltros({...filtros, ubicacion: e.target.value})}
              >
                <option value="">Todas</option>
                <option value="Bogotá">Bogotá</option>
                <option value="Medellín">Medellín</option>
                <option value="Cali">Cali</option>
                <option value="Barranquilla">Barranquilla</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              >
                <option value="">Todos</option>
                <option value="destacados">Destacados</option>
                <option value="proximos">Próximos a finalizar</option>
                <option value="exitosos">Exitosos</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Resultados */}
      <div className="results-header">
        <h2>{proyectosFiltrados.length} Proyectos encontrados</h2>
        <div className="sort-options">
          <span>Ordenar por:</span>
          <select>
            <option>Más recientes</option>
            <option>Más populares</option>
            <option>Mayor financiamiento</option>
          </select>
        </div>
      </div>

      {/* Grid de proyectos */}
      <div className="proyectos-feed-container">
      <div className="projects-grid">
        {proyectosFiltrados.length > 0 ? (
          proyectosFiltrados.map((proyecto) => (
            <div key={proyecto.id} className={`project-card ${proyecto.destacado ? "featured" : ""}`}>
              {proyecto.destacado && <span className="featured-badge">Destacado</span>}
              <img src={proyecto.imagen} alt={proyecto.titulo} />
              
              <div className="project-info">
                <div className="project-meta">
                  <span className="category">{proyecto.categoria}</span>
                  <span className="location"><FiMapPin /> {proyecto.ubicacion}</span>
                </div>
                
                <h3>{proyecto.titulo}</h3>
                <p className="description">{proyecto.descripcion}</p>
                
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.round((proyecto.recaudado / proyecto.meta) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="progress-stats">
                    <span>${proyecto.recaudado} recaudados</span>
                    <span>{Math.round((proyecto.recaudado / proyecto.meta) * 100)}%</span>
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