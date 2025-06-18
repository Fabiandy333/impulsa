import express from 'express';
import pool  from '../../db.js';

const router = express.Router();

// Crear nuevo proyecto
router.post('/proyecto', async (req, res) => {
  const {
    titulo,
    descripcion,
    montoMeta,
    fechaCierre,
    videoUrl,
    imagenPrincipalUrl,
    idUsuario,
    idCategoria
  } = req.body;

  try {
    const insertQuery = `
      INSERT INTO proyecto (
        titulo, descripcion, montoMeta, fechaCierre,
        videoUrl, imagenPrincipalUrl, idUsuario, idCategoria
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      titulo,
      descripcion,
      montoMeta,
      fechaCierre,
      videoUrl,
      imagenPrincipalUrl,
      idUsuario,
      idCategoria
    ];

    const result = await pool.query(insertQuery, values);

    res.status(201).json({ mensaje: 'Proyecto creado con éxito', proyecto: result.rows[0] });
  } catch (error) {
    console.error('❌ Error al crear proyecto:', error);
    res.status(500).json({ mensaje: 'Error al crear proyecto', error: error.message });
  }
});


router.get('/proyecto', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.idproyecto, p.titulo, p.descripcion, p.montometa, p.fechacierre,
       p.videourl, p.imagenprincipalurl, c.nombrecategoria, u.nombre AS creador,
       COALESCE(SUM(co.monto), 0) AS recaudado
    FROM proyecto p
    JOIN categoria c ON p.idcategoria = c.idcategoria
    JOIN usuario u ON p.idusuario = u.idusuario
    LEFT JOIN contribucion co ON p.idProyecto = co.idProyecto
    GROUP BY p.idProyecto, c.nombreCategoria, u.nombre
    `);
    console.log('✅ Categorías obtenidas:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener proyectos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/usuario/:id/proyectos-creados', async (req, res) => {
  const idUsuario = parseInt(req.params.id);

  try {
    const result = await pool.query(`
      SELECT 
        p.idProyecto,
        p.titulo,
        p.descripcion,
        p.montoMeta,
        p.fechaCierre,
        c.nombreCategoria,
        COALESCE(SUM(co.monto), 0) AS recaudado
      FROM proyecto p
      JOIN categoria c ON p.idCategoria = c.idCategoria
      LEFT JOIN contribucion co ON p.idProyecto = co.idProyecto
      WHERE p.idUsuario = $1
      GROUP BY p.idProyecto, c.nombreCategoria
    `, [idUsuario]);

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener proyectos creados:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


router.get('/usuario/:id/proyectos-apoyados', async (req, res) => {
  const idUsuario = parseInt(req.params.id);

  try {
    const result = await pool.query(`
      SELECT 
        p.idProyecto,
        p.titulo,
        p.descripcion,
        p.montoMeta,
        c.nombreCategoria,
        SUM(co.monto) AS monto
      FROM contribucion co
      JOIN proyecto p ON co.idProyecto = p.idProyecto
      JOIN categoria c ON p.idCategoria = c.idCategoria
      WHERE co.idUsuario = $1
      GROUP BY p.idProyecto, c.nombreCategoria
    `, [idUsuario]);

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener proyectos apoyados:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
