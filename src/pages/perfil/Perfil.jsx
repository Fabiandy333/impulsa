import React, { useEffect, useState } from 'react';
import './Perfil.css';
import axios from 'axios';
import useAuth from '../auth/use-auth';
import avatar from "../../../public/avatar.png";

export const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [imagen, setImagen] = useState(null);
  const { userLooged } = useAuth();
  const [proyectosCreados, setProyectosCreados] = useState([]);
  const [proyectosApoyados, setProyectosApoyados] = useState([]);

  useEffect(() => {
    const obtenerPerfil = async () => {
      if (!userLooged || !userLooged.idusuario) {
        console.warn("❗ userLooged no tiene idusuario:", userLooged);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:43674/api/usuario/${userLooged.idusuario}`);
        setUsuario(res.data);
      } catch (error) {
        console.error('❌ Error al obtener perfil:', error);
      }
    };

    const fetchProyectos = async () => {
      if (!userLooged?.idusuario) return;

      try {
        const creadosRes = await axios.get(`http://localhost:43674/api/usuario/${userLooged.idusuario}/proyectos-creados`);
        const apoyadosRes = await axios.get(`http://localhost:43674/api/usuario/${userLooged.idusuario}/proyectos-apoyados`);
        
        setProyectosCreados(creadosRes.data);
        console.log('✅ Proyectos creados:', creadosRes.data);
        console.log('✅ Proyectos apoyados:', apoyadosRes.data);
        setProyectosApoyados(apoyadosRes.data);
      } catch (error) {
        console.error('❌ Error al obtener proyectos:', error);
      }
    };

    fetchProyectos();
    obtenerPerfil();
  }, [userLooged]);

  const handleGuardar = async () => {
    try {
      const datosPerfil = {
        nombre: usuario.nombre || '',
        biografia: usuario.biografia || '',
        fotoPerfilUrl: usuario.fotoPerfilUrl || '', // evita undefined
        idRol: parseInt(usuario.idRol) || 2,        // convierte a número
        redesSociales: usuario.redesSociales || []
      };

      await axios.put(`http://localhost:43674/api/usuario/${userLooged.idusuario}/actualizar`, datosPerfil);
      setEditando(false);
    } catch (err) {
      console.error('Error al guardar perfil:', err);
    }
  };


  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagen(file);

    // Simular una URL pública
    const fakeUrl = URL.createObjectURL(file);
    setUsuario({ ...usuario, fotoPerfilUrl: fakeUrl });
  };


  const handleInputChange = (e, key) => {
    setUsuario({ ...usuario, [key]: e.target.value });
  };

  const handleRedSocialChange = (index, key, value) => {
    const nuevasRedes = [...usuario.redesSociales];
    nuevasRedes[index][key] = value;
    setUsuario({ ...usuario, redesSociales: nuevasRedes });
  };

  const agregarRedSocial = () => {
  const nuevas = [...usuario.redesSociales, { tipo: '', url: '' }];
  setUsuario({ ...usuario, redesSociales: nuevas });
};


  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <div className="perfil-sidebar">
        <div className="perfil-avatar">
          <img src={imagen ? URL.createObjectURL(imagen) : usuario.fotoPerfilUrl || avatar} alt="avatar" />
          <div className="perfil-upload">
            <input type="file" onChange={handleImagenChange} />
          </div>
        </div>
        <div className="perfil-meta">
          <p><strong>Nombre:</strong></p>
          {editando ? (
            <input
              value={usuario.nombre}
              onChange={(e) => handleInputChange(e, 'nombre')}
            />
          ) : (
            <p>{usuario.nombre}</p>
          )}
          <p><strong>Correo:</strong> </p>
          <p>{usuario.email}</p>
          <p><strong>Rol:</strong></p>
          {editando ? (
            <select
            value={usuario.idRol}
            onChange={(e) => handleInputChange(e, 'idRol')}
          >
            <option value="1">creador</option>
            <option value="2">patrocinador</option>
          </select>
          ) : (
            <p>{usuario.nombrerol}</p>
          )}
        </div>
      </div>

      <div className="perfil-content">
        <section className="perfil-seccion">
          <h3>Biografía</h3>
          {editando ? (
            <textarea
              value={usuario.biografia}
              onChange={(e) => handleInputChange(e, 'biografia')}
            />
          ) : (
            <p>{usuario.biografia}</p>
          )}
        </section>

        <section className="perfil-seccion">
          <h3>Redes sociales</h3>
          {usuario.redesSociales.map((red, i) => (
            <div key={red.idredsocial || i} className="perfil-red">
              {editando ? (
                <>
                  <input
                    placeholder="Tipo de red (Ej: Instagram)"
                    value={red.tipo}
                    onChange={(e) => handleRedSocialChange(i, 'tipo', e.target.value)}
                  />
                  <input
                    placeholder="URL (Ej: https://instagram.com/usuario)"
                    value={red.url}
                    onChange={(e) => handleRedSocialChange(i, 'url', e.target.value)}
                  />
                </>
              ) : (
                <p><strong>{red.tipo}:</strong> <a href={red.url}>{red.url}</a></p>
              )}
            </div>
          ))}

          {editando && (
            <button onClick={agregarRedSocial} className="perfil-btn-agregar">
              + Añadir red social
            </button>
          )}
        </section>

        <section className="perfil-seccion">
        <h3>Proyectos creados</h3>
        <div className="tarjetas-contenedor">
          {(proyectosCreados || []).map((proyecto) => {
            const recaudado = proyecto.recaudado ?? 0;
            const montometa = proyecto.montometa ?? 1;
            const porcentaje = Math.min(Math.round((recaudado / montometa) * 100), 100);

            return (
              <div key={proyecto.idproyecto} className="tarjeta-proyecto">
                <h4>{proyecto.titulo}</h4>
                <p className="descripcion">{proyecto.descripcion}</p>
                <p className="meta">
                  ${Number(proyecto.recaudado).toLocaleString("es-CO")} / ${Number(proyecto.montometa).toLocaleString("es-CO")}
                </p>

                <div className="barra-progreso">
                  <div className="progreso" style={{ width: `${porcentaje}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="perfil-seccion">
        <h3>Proyectos apoyados</h3>
        <div className="tarjetas-contenedor">
          {(proyectosApoyados || []).map((proyecto) => {
            const montoApoyado = proyecto.monto ?? 0;
            return (
              <div key={proyecto.idproyecto} className="tarjeta-proyecto apoyado">
                <h4>{proyecto.titulo}</h4>
                <p className="descripcion">{proyecto.descripcion}</p>
                <p className="monto-apoyado">
                  💰 Apoyaste con ${Number(proyecto.monto).toLocaleString("es-CO")}
                </p>

              </div>
            );
          })}
        </div>
      </section>

        <div className="perfil-acciones">
          {editando ? (
            <button onClick={handleGuardar}>Guardar cambios</button>
          ) : (
            <button onClick={() => setEditando(true)}>Editar perfil</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;