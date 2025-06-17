// src/routes/usuario.js
import express from 'express';
import pool from '../../db.js';
const router = express.Router();

// Ruta para login
router.post('/login', async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuario WHERE email = $1 AND contraseña = $2',
      [email, contraseña]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.idUsuario,
          nombre: user.nombre,
          correo: user.email,
          rol: user.idRol
        }
      });
    } else {
      res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;

