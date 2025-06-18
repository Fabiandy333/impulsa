import React, { useState, useEffect } from 'react';
import './CreateProject.css';
import axios from 'axios';
import useAuth from '../auth/use-auth';

const CreateProject = () => {
  const { userLooged } = useAuth();
  const [proyecto, setProyecto] = useState({
    titulo: '',
    descripcion: '',
    montoMeta: '',
    fechaCierre: '',
    videoUrl: '',
    imagenPrincipalUrl: '',
    idCategoria: '',
  });
  const [categorias, setCategorias] = useState([]);
  

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const res = await axios.get('http://localhost:43674/api/categorias');
        setCategorias(res.data);
      } catch (error) {
        console.error('❌ Error al cargar categorías:', error);
      }
    }
    obtenerCategorias();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProyecto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userLooged || !userLooged.idusuario) {
      console.error('❌ Usuario no autenticado');
      return;
    }

    try {
      const response = await fetch('http://localhost:43674/api/proyecto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...proyecto,
          idUsuario: userLooged.idusuario,
          idCategoria: parseInt(proyecto.idCategoria, 10),
        }),
      });

      if (!response.ok) throw new Error('Error al crear el proyecto');

      alert('✅ Proyecto creado con éxito');

      setProyecto({
        titulo: '',
        descripcion: '',
        montoMeta: '',
        fechaCierre: '',
        videoUrl: '',
        imagenPrincipalUrl: '',
        idCategoria: '',
      });
    } catch (error) {
      console.error('❌ Error al crear proyecto:', error);
    }
  };

  return (
    <div className="crear-proyecto">
      <h2>🎯 Crea tu proyecto</h2>
      <form onSubmit={handleSubmit} className="formulario-proyecto">
        <div className="campo">
          <label>Título del proyecto</label>
          <input type="text" name="titulo" value={proyecto.titulo} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Descripción</label>
          <textarea name="descripcion" value={proyecto.descripcion} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Monto meta (COP)</label>
          <input type="number" name="montoMeta" value={proyecto.montoMeta} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Fecha de cierre</label>
          <input type="date" name="fechaCierre" value={proyecto.fechaCierre} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Categoría</label>
          <select name="idCategoria" value={proyecto.idCategoria} onChange={handleChange} required>
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.idcategoria} value={cat.idcategoria}>
                {cat.nombrecategoria}
              </option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label>URL de video</label>
          <input type="url" name="videoUrl" value={proyecto.videoUrl} onChange={handleChange} />
        </div>
        <div className="campo">
          <label>URL de imagen principal</label>
          <input type="url" name="imagenPrincipalUrl" value={proyecto.imagenPrincipalUrl} onChange={handleChange} />
        </div>
        <button type="submit" className="btn-crear">Crear Proyecto</button>
      </form>
    </div>
  );
};

export default CreateProject;
