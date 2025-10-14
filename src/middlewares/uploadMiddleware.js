const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Ruta absoluta a la carpeta uploads dentro de src/
const uploadPath = path.join(__dirname, '..', 'uploads');

// ✅ Crear carpeta si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📂 Carpeta 'uploads/' creada automáticamente");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📁 Guardando en carpeta:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log("🧤 Nombre final del archivo:", uniqueName);
    cb(null, uniqueName);
  },
});

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('❌ Solo se permiten imágenes JPG y PNG'));
    }
  },
});

module.exports = uploadMiddleware;