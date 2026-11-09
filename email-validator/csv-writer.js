const { writeFile } = require('node:fs/promises');

function escapeCsvField(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function formatCsv(rows) {
  const header = ['email', 'status', 'motivo'].map(escapeCsvField).join(',');
  const records = rows.map((row) => [row.email, row.status, row.motivo].map(escapeCsvField).join(','));
  return `\uFEFF${[header, ...records].join('\r\n')}\r\n`;
}

async function writeCsv(filePath, rows) {
  try {
    await writeFile(filePath, formatCsv(rows), 'utf8');
  } catch (error) {
    throw new Error(`Falha ao gerar o CSV em "${filePath}": ${error.message}`, { cause: error });
  }
}

module.exports = { formatCsv, writeCsv };