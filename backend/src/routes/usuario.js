// src/routes/Usuario.js
import express from 'express';
import pool from '../../db.js';

const router = express.Router();

// Ruta para crear usuario
router.post('/usuario', async (req, res) => {
  const { nombre, email, contraseña, idRol } = req.body;

  try {
    const query = `
      INSERT INTO usuario (nombre, email, contraseña, idRol)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(query, [nombre, email, contraseña, idRol]);

    res.status(200).json({ mensaje: 'Usuario creado con éxito' });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});


/**
 * Actualizar perfil del usuario
 * Ruta: PUT /api/usuario/:id
 * Body esperado: { fotoPerfilUrl, biografia }
 */
router.put('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { fotoPerfilUrl, biografia } = req.body;

  try {
    const query = `
      UPDATE usuario
      SET fotoPerfilUrl = $1, biografia = $2
      WHERE idUsuario = $3
    `;
    const values = [fotoPerfilUrl, biografia, id];
    await pool.query(query, values);

    res.status(200).json({ mensaje: 'Perfil actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

/**
 * Agregar una red social al usuario
 * Ruta: POST /api/red-social
 * Body esperado: { tipo, url, idUsuario }
 */
router.post('/red-social', async (req, res) => {
  const { tipo, url, idUsuario } = req.body;

  try {
    const query = `
      INSERT INTO redSocial (tipo, url, idUsuario)
      VALUES ($1, $2, $3)
    `;
    await pool.query(query, [tipo, url, idUsuario]);

    res.status(200).json({ mensaje: 'Red social agregada con éxito' });
  } catch (error) {
    console.error('Error al guardar red social:', error);
    res.status(500).json({ error: 'Error al guardar red social' });
  }
});

export default router;
