import React from 'react';
import './Perfil.css';
import axios from 'axios';

export const Perfil = () => {

  const handleGuardar = async () => {
    const descripcion = document.querySelector('.perfil-textarea').value;
    const inputs = document.querySelectorAll('.perfil-input');
    const facebook = inputs[0].value;
    const instagram = inputs[1].value;
    const linkedin = inputs[2].value;
    const imagen = 'foto.jpg';

    try {
      const response = await axios.post('https://localhost:43674/api/perfil', {
        descripcion,
        facebook,
        instagram,
        linkedin,
        imagen,
      });
      console.log(response.data.mensaje);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <h2>Editar Perfil</h2>
      </header>

      <main className="perfil-main">
        <div className="perfil-upload">
          <label htmlFor="file" className="file-label">Subir foto</label>
          <input type="file" id="file" className="perfil-file" />
        </div>

        <textarea 
          className="perfil-textarea" 
          placeholder="Escribe algo sobre ti..."
        />

        <div className="perfil-inputs">
          <input type="text" className="perfil-input" placeholder="Facebook" />
          <input type="text" className="perfil-input" placeholder="Instagram" />
          <input type="text" className="perfil-input" placeholder="LinkedIn" />
        </div>

        <section className="perfil-section">
          <h3>Proyectos creados</h3>
          <p>Aquí puedes listar los proyectos que creó el usuario.</p>
        </section>

        <section className="perfil-section">
          <h3>Proyectos apoyados</h3>
          <p>Aquí puedes listar los proyectos que ha apoyado.</p>
        </section>
      </main>

      <footer className="perfil-footer">
        <button className="perfil-button" onClick={handleGuardar}>
          Guardar cambios
        </button>
      </footer>
    </div>
  );
};

export default Perfil;

