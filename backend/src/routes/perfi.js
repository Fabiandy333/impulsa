import express from 'express';
import pool from '../../db.js';

const router = express.Router();

// Obtener perfil
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userRes = await pool.query(`
      SELECT u.idusuario, u.nombre, u.email, u.fotoperfilurl, u.biografia, r.nombrerol
      FROM usuario u
      JOIN rol r ON u.idrol = r.idrol
      WHERE u.idusuario = $1
    `, [id]);

    const redesRes = await pool.query(`
      SELECT idredsocial, tipo, url
      FROM redsocial
      WHERE idusuario = $1
    `, [id]);

    if (userRes.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({
      ...userRes.rows[0],
      redesSociales: redesRes.rows
    });
  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Actualizar perfil
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { biografia, rol, redesSociales, fotoPerfilUrl } = req.body;

  try {
    await pool.query('BEGIN');

    // Actualiza biografía y foto
    await pool.query(`
      UPDATE usuario
      SET biografia = $1, fotoperfilurl = $2
      WHERE idusuario = $3
    `, [biografia, fotoPerfilUrl, id]);

    // Si se envía un nuevo rol
    if (rol) {
      const rolRes = await pool.query(`SELECT idrol FROM rol WHERE nombrerol = $1 LIMIT 1`, [rol]);
      if (rolRes.rows.length > 0) {
        await pool.query(`UPDATE usuario SET idrol = $1 WHERE idusuario = $2`, [rolRes.rows[0].idrol, id]);
      }
    }

    // Actualiza redes sociales
    for (const red of redesSociales) {
      if (red.idredsocial) {
        // Si existe, actualizar
        await pool.query(`
          UPDATE redsocial SET tipo = $1, url = $2 WHERE idredsocial = $3 AND idusuario = $4
        `, [red.tipo, red.url, red.idredsocial, id]);
      } else {
        // Si no existe, insertar nueva
        await pool.query(`
          INSERT INTO redsocial (tipo, url, idusuario) VALUES ($1, $2, $3)
        `, [red.tipo, red.url, id]);
      }
    }

    await pool.query('COMMIT');
    res.json({ mensaje: 'Perfil actualizado correctamente' });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

export default router;
