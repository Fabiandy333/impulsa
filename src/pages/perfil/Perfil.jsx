import React, { useEffect, useState } from 'react';
import './Perfil.css';
import axios from 'axios';

export const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await axios.get('http://localhost:43674/api/usuario/actual'); // Ajustar URL según backend
        setUsuario(res.data);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };

    obtenerPerfil();
  }, []);

  const handleGuardar = async () => {
    try {
      const datosPerfil = {
        nombre: usuario.nombre || '',
        biografia: usuario.biografia || '',
        fotoPerfilUrl: usuario.fotoPerfilUrl || '', // evita undefined
        idRol: parseInt(usuario.idRol) || 2,        // convierte a número
        redesSociales: usuario.redesSociales || []
      };

      await axios.put('http://localhost:43674/api/usuario/actualizar', datosPerfil);
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
          <img src={imagen ? URL.createObjectURL(imagen) : usuario.fotoPerfilUrl || '/user-icon.png'} alt="avatar" />
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
          <p>Aquí puedes listar los proyectos que creó el usuario.</p>
        </section>

        <section className="perfil-seccion">
          <h3>Proyectos apoyados</h3>
          <p>Aquí puedes listar los proyectos que ha apoyado.</p>
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