const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const { card: Card } = require('../db');

// Convierte fechas tipo "DD/MM/YYYY" a "YYYY-MM-DD"
const normalizeDate = (input) => {
  if (!input || typeof input !== 'string') return null;
  const [day, month, year] = input.split('/');
  if (!day || !month || !year) return null;
  const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  const date = new Date(iso);
  return isNaN(date.getTime()) ? null : date;
};

const loadCards = async () => {
  console.log('🚀 Iniciando carga de cards...');
  const filePath = path.join(__dirname, '..', 'utils', 'cards.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const cards = JSON.parse(rawData);

  try {
    for (const card of cards) {
      // Normalizamos la fecha
     card.fecha = normalizeDate(card.fecha);
if (!card.fecha) {
  console.log(`⚠️ Fecha inválida en card ${card.dominio}: ${card.fecha}`);
  continue;
}

      // Insertamos sin filtrar por dominio
      const created = await Card.create(card);
      console.log(`✅ Card creado con ID ${created.id}`);
    }

    console.log('🏁 Todos los cards fueron cargados exitosamente');
  } catch (error) {
    console.error('❌ Error al cargar los cards:', error);
  }
};

loadCards();
