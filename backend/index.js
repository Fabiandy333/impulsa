// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './src/routes/usuario.js';
import loginRoutes from './src/routes/login.js';

dotenv.config();

const app = express();

// Configura CORS para aceptar peticiones desde tu frontend
app.use(cors({
  origin: 'http://localhost:5173', // solo el origen de desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use('/api', usuarioRoutes);
app.use('/api', loginRoutes);

app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

const PORT = process.env.PORT || 43674;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
