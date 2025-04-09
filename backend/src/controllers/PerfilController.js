let perfilGuardado = {}; // Simulando BD

exports.guardarPerfil = (req, res) => {
  perfilGuardado = req.body;
  res.json({ message: 'Perfil guardado correctamente' });
};

exports.obtenerPerfil = (req, res) => {
  res.json(perfilGuardado);
};
