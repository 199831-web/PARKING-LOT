const express = require("express");
const multer = require("multer");
const path = require("path"); 
const { sequelize, Usuario, Vehiculo } = require("./models");

const app = express();
const upload = multer();

//  ENTRADAS TEMPORALES
const entradasRegistradas = [];

// Conexión a base de datos
sequelize.authenticate()
  .then(() => console.log("✅ Conectado a MySQL"))
  .catch((err) => console.error("❌ Error al conectar a MySQL:", err.message));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Función para mapear tipoUsuario a ID
function getPerfilId(tipoUsuario) {
  switch (tipoUsuario) {
    case "admin": return 1;
    case "operador": return 2;
    case "usuario": return 3;
    default: return 3;
  }
}

// Función para obtener nombre de perfil por ID
function getPerfilNombre(id) {
  switch (id) {
    case 1: return "admin";
    case 2: return "operador";
    case 3: return "usuario";
    default: return "usuario";
  }
}

//  Login de usuario con redirección por rol
app.post("/api/login", async (req, res) => {
  const { email, clave } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { direccion_correo: email, clave } });

    if (!usuario) {
      return res.status(401).json({ mensaje: "Correo o clave incorrectos" });
    }

    const rol = getPerfilNombre(usuario.PERFIL_USUARIO_id);
    res.json({ mensaje: "Login correcto", rol });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// 📌 Registro de usuario y vehículo
app.post("/api/registro-completo", upload.none(), async (req, res) => {
  try {
    const {
      tipoDocumento,
      documento,
      nombre,
      email,
      celular,
      clave,
      tipoUsuario,
      placa,
      marca,
      modelo,
      color,
      tipo
    } = req.body;

    const nuevoUsuario = await Usuario.create({
      tipo_documento: tipoDocumento,
      numero_documento: documento,
      primer_nombre: nombre,
      direccion_correo: email,
      numero_celular: celular,
      clave: clave,
      estado: "activo",
      PERFIL_USUARIO_id: getPerfilId(tipoUsuario)
    });

    if (placa && marca && modelo) {
      await Vehiculo.create({
        placa,
        marca,
        modelo,
        color,
        tipo,
        USUARIO_id: nuevoUsuario.id
      });
    }

    res.json({ mensaje: "Usuario y vehículo registrados correctamente." });
  } catch (error) {
    console.error("❌ Error al registrar:", error);
    res.status(500).json({ mensaje: "Error al registrar usuario y vehículo." });
  }
});

// ✅ Obtener usuarios
app.get("/api/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "primer_nombre", "estado"]
    });
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: "Error al obtener usuarios." });
  }
});

// ✅ Actualizar usuario
app.put("/api/usuarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, estado } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuario.primer_nombre = nombre || usuario.primer_nombre;
    usuario.estado = estado || usuario.estado;

    await usuario.save();
    res.json({ mensaje: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ mensaje: "Error al actualizar usuario." });
  }
});

// ✅ Eliminar usuario
app.delete("/api/usuarios/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    await usuario.destroy();
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario." });
  }
});

// ✅ Registrar entrada de vehículo
app.post("/api/entradas", async (req, res) => {
  try {
    const { placa, celda } = req.body;

    if (!placa || !celda) {
      return res.status(400).json({ error: "Placa y celda son obligatorios" });
    }

    const hora = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
    entradasRegistradas.push({ placa, celda, hora });

    console.log(`📥 Entrada registrada: Placa ${placa}, Celda ${celda}, Hora ${hora}`);
    res.json({ mensaje: "Entrada registrada exitosamente", hora });
  } catch (error) {
    console.error("❌ Error al registrar entrada:", error);
    res.status(500).json({ error: "Error al registrar entrada" });
  }
});

// ✅ Ver entradas registradas
app.get("/api/entradas", (req, res) => {
  res.json(entradasRegistradas);
});

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
