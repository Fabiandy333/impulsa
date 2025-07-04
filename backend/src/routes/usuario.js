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


// Obtener perfil del usuario logueado 
router.get('/usuario/:id', async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  console.log('Obteniendo perfil para el usuario con ID:', idUsuario);

  try {
    const usuarioQuery = `
      SELECT u.idUsuario, u.nombre, u.email, u.biografia, u.fotoPerfilUrl, r.nombreRol
      FROM usuario u
      JOIN rol r ON u.idRol = r.idRol
      WHERE u.idUsuario = $1
    `;
    const usuarioResult = await pool.query(usuarioQuery, [idUsuario]);

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const redesQuery = `
      SELECT idRedSocial, tipo, url
      FROM redSocial
      WHERE idUsuario = $1
    `;
    const redesResult = await pool.query(redesQuery, [idUsuario]);

    const datosPerfil = {
      ...usuarioResult.rows[0],
      redesSociales: redesResult.rows
    };

    //Mostrar datos completos en consola
    console.log('Perfil del usuario:', JSON.stringify(datosPerfil, null, 2));

    res.json(datosPerfil);
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Actualizar perfil completo del usuario
router.put('/usuario/:id/actualizar', async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const { nombre, biografia, fotoPerfilUrl, redesSociales, idRol } = req.body;
  console.log('Datos recibidos para actualizar perfil:', req.body);

  try {
    const idRolInt = parseInt(idRol);
    if (isNaN(idRolInt)) {
      return res.status(400).json({ mensaje: 'idRol inválido' });
    }

    // Usa idRolInt en la query
    await pool.query(
      `UPDATE usuario SET nombre = $1, biografia = $2, fotoPerfilUrl = $3, idRol = $4 WHERE idUsuario = $5`,
      [nombre, biografia, fotoPerfilUrl, idRolInt, idUsuario]
    );

    // Eliminar redes anteriores
    await pool.query(`DELETE FROM redSocial WHERE idUsuario = $1`, [idUsuario]);

    // Insertar redes nuevas
    for (const red of redesSociales) {
      if (!red.tipo || !red.url) continue;
      await pool.query(
        `INSERT INTO redSocial (tipo, url, idUsuario) VALUES ($1, $2, $3)`,
        [red.tipo, red.url, idUsuario]
      );
    }

    res.json({ mensaje: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ mensaje: 'Error interno al actualizar perfil' });
  }
});

// src/routes/usuario.js

router.get('/usuario/correo/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      'SELECT idusuario, nombre, email, idrol FROM usuario WHERE email = $1',
      [email]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al buscar usuario por correo:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});


export default router;
