const assert = require('node:assert/strict');
const { mkdtemp, readFile, rm } = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { formatCsv, writeCsv } = require('./csv-writer');
const { validateEmail, validateEmailSyntax, validateEmails } = require('./validator');

test('accepts a syntactically valid email', () => {
  assert.equal(validateEmailSyntax('qa@example.com').status, 'válido');
});

test('explains common syntax failures', () => {
  assert.match(validateEmailSyntax('userexample.com').motivo, /@/);
  assert.match(validateEmailSyntax('user@').motivo, /ausente/);
  assert.match(validateEmailSyntax('user@example').motivo, /extensão/);
  assert.match(validateEmailSyntax('first last@example.com').motivo, /espaços/);
  assert.match(validateEmailSyntax('invalid<>@example.com').motivo, /inválido/);
});

test('validates multiple addresses and an empty list', async () => {
  const results = await validateEmails(['ok@example.com', 'broken-address']);
  assert.deepEqual(results.map((result) => result.status), ['válido', 'inválido']);
  assert.deepEqual(await validateEmails([]), []);
});

test('checks MX records only when requested', async () => {
  const result = await validateEmail('qa@example.com', {
    checkDns: true,
    mxResolver: async (domain) => {
      assert.equal(domain, 'example.com');
      return [{ exchange: 'mx.example.com', priority: 10 }];
    },
  });
  assert.equal(result.status, 'válido');
  assert.match(result.motivo, /MX/);
});

test('marks unavailable DNS as not verified without failing validation', async () => {
  const unavailableResolver = async () => {
    const error = new Error('DNS unavailable');
    error.code = 'ECONNREFUSED';
    throw error;
  };
  const result = await validateEmail('qa@example.com', {
    checkDns: true,
    mxResolver: unavailableResolver,
  });

  assert.equal(result.status, 'não verificado');
  assert.match(result.motivo, /DNS/);
});

test('encodes a UTF-8 CSV with escaped fields and the expected header', () => {
  const csv = formatCsv([{ email: 'a,b@example.com', status: 'inválido', motivo: 'motivo "especial"' }]);

  assert.ok(csv.startsWith('\uFEFF"email","status","motivo"'));
  assert.match(csv, /"a,b@example\.com","inválido","motivo ""especial"""/);
});

test('writes the CSV and reports output errors', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'email-validator-'));
  const output = path.join(directory, 'emails.csv');
  try {
    await writeCsv(output, [{ email: 'qa@example.com', status: 'válido', motivo: 'Sintaxe válida' }]);
    assert.match(await readFile(output, 'utf8'), /qa@example\.com/);
    await assert.rejects(
      writeCsv(path.join(directory, 'missing', 'emails.csv'), []),
      /Falha ao gerar o CSV/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});