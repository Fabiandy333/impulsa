const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/PerfilController');

router.post('/', perfilController.guardarPerfil);
router.get('/', perfilController.obtenerPerfil);

module.exports = router;
