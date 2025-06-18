import { useState, useEffect } from "react";
import "./Inicio.css";

// Datos de ejemplo para proyectos (simular API)
// const proyectosEjemplo = [
//   {
//     id: 1,
//     titulo: "App de Salud Mental",
//     creador: "Ana Pérez",
//     descripcion: "Desarrollo de una app para seguimiento de bienestar emocional con recordatorios y recursos.",
//     categoria: "Tecnología",
//     meta: 5000,
//     recaudado: 3200,
//     fechaCierre: "2025-12-15",
//     imagen: "https://via.placeholder.com/600x400?text=App+Salud+Mental",
//     recompensas: [
//       { monto: 20, descripcion: "Acceso beta temprano" },
//       { monto: 50, descripcion: "Nombre en créditos + beta" },
//     ],
//   },
//   {
//     id: 2,
//     titulo: "Documental Sostenibilidad",
//     creador: "Carlos Gómez",
//     descripcion: "Filmación de un documental sobre comunidades sostenibles en América Latina.",
//     categoria: "Arte",
//     meta: 10000,
//     recaudado: 7800,
//     fechaCierre: "2025-11-30",
//     imagen: "https://via.placeholder.com/600x400?text=Documental+Sostenibilidad",
//     recompensas: [
//       { monto: 30, descripcion: "Copia digital del documental" },
//       { monto: 100, descripcion: "Invitación al estreno" },
//     ],
//   },
// ];

// Datos de ejemplo ampliados (20 proyectos para probar scroll)
const proyectosEjemplo = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  titulo: `Proyecto ${i + 1}: ${["App Salud", "Documental", "Libro", "Tecnología Verde"][i % 4]}`,
  creador: `Creador ${i + 1}`,
  descripcion: `Descripción del proyecto innovador ${i + 1}. Este proyecto busca revolucionar su área con un enfoque único.`,
  categoria: ["Tecnología", "Arte", "Educación", "Social"][i % 4],
  meta: 5000 + (i * 1000),
  recaudado: 2000 + (i * 500),
  fechaCierre: `2025-${12 - (i % 6)}-${15 + (i % 10)}`,
  recompensas: [
    { monto: 20, descripcion: "Recompensa básica" },
    { monto: 50, descripcion: "Recompensa premium" },
  ],
}));

const Inicio = () => {
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProyectos(proyectosEjemplo);
      setCargando(false);
    }, 1000);
  }, []);

  const calcularPorcentaje = (recaudado, meta) => {
    return Math.min(Math.round((recaudado / meta) * 100), 100);
  };

  return (
    <div className="inicio-container">
      <div className="header-inicio">
        <h2>Descubre proyectos innovadores</h2>
      </div>

      {cargando ? (
        <p>Cargando proyectos...</p>
      ) : (
        <div className="proyectos-feed-container">
          <div className="proyectos-feed">
            {proyectos.map((proyecto) => (
              <div key={proyecto.id} className="proyecto-card">
                <div className="proyecto-info">
                  <h2>{proyecto.titulo}</h2>
                  <p className="creador">Por: {proyecto.creador}</p>
                  <p className="descripcion">{proyecto.descripcion}</p>
                  <div className="categoria-meta">
                    <span className="categoria">{proyecto.categoria}</span>
                    <span className="meta">
                      ${proyecto.recaudado} de ${proyecto.meta}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${calcularPorcentaje(proyecto.recaudado, proyecto.meta)}%` }}
                    ></div>
                  </div>
                  <div className="recompensas">
                    <h4>Recompensas:</h4>
                    <ul>
                      {proyecto.recompensas.map((recompensa, index) => (
                        <li key={index}>
                          <strong>${recompensa.monto}:</strong> {recompensa.descripcion}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="boton-apoyar">Apoyar este proyecto</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inicio;