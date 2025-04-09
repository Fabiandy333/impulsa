// src/db.js
import mysql from 'mysql2/promise';

export const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // tu contraseña si tienes
  database: 'impulsa_db'  // crea esta base de datos en phpmyadmin
});
