import express from 'express';
import pool from '../../db.js';

const router = express.Router();
// Obtener todas las categorías
router.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categoria');
    console.log('✅ Categorías obtenidas:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
});

export default router;
