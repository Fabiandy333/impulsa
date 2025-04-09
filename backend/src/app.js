import express from 'express';
import cors from 'cors';
import { connection } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

app.post('/api/perfil', async (req, res) => {
  const { descripcion, facebook, instagram, linkedin, imagen } = req.body;

  try {
    await connection.execute(
      'INSERT INTO perfil (descripcion, facebook, instagram, linkedin, imagen) VALUES (?, ?, ?, ?, ?)',
      [descripcion, facebook, instagram, linkedin, imagen]
    );

    res.status(201).json({ mensaje: 'Perfil guardado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al guardar el perfil' });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});

