import express from 'express';
import pool from '../../db.js';

const router = express.Router();
// POST /api/contribucion
router.post('/contribucion', async (req, res) => {
  const {
    monto,
    anonima,
    idUsuario,
    idProyecto,
    idMetodoPago
  } = req.body;

  const idRecompensa = null;
  const idEstadoPago = 1;

  try {
    await pool.query(`
      INSERT INTO contribucion (
        monto, anonima, idUsuario, idRecompensa,
        idMetodoPago, idEstadoPago, idProyecto
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [monto, anonima, idUsuario, idRecompensa, idMetodoPago, idEstadoPago, idProyecto]);

    res.status(201).json({ mensaje: 'Contribución registrada exitosamente' });
  } catch (error) {
    console.error('❌ Error al registrar contribución:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


router.get('/metodos-pago', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM metodopago');
    console.log('✅ Métodos de pago obtenidos:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener métodos de pago:', error);
    res.status(500).json({ error: 'Error al obtener métodos de pago' });
  }
});

export default router;
