const { resolveMx } = require('node:dns/promises');

const LOCAL_PART_PATTERN = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
const DOMAIN_PATTERN = /^(?=.{1,253}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
const TEMPORARY_DNS_CODES = new Set([
  'EAI_AGAIN',
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEOUT',
  'ENETUNREACH',
]);

function invalid(email, motivo) {
  return { email, status: 'inválido', motivo };
}

function validateEmailSyntax(email) {
  if (typeof email !== 'string') {
    return invalid(String(email ?? ''), 'O valor do e-mail deve ser texto');
  }
  if (email.length === 0) {
    return invalid(email, 'E-mail vazio');
  }
  if (/\s/.test(email)) {
    return invalid(email, 'E-mail contém espaços');
  }

  const atIndex = email.indexOf('@');
  if (atIndex === -1 || atIndex !== email.lastIndexOf('@')) {
    return invalid(email, 'E-mail deve conter exatamente um caractere @');
  }

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (!localPart || !domain) {
    return invalid(email, 'Parte local ou domínio ausente');
  }
  if (!domain.includes('.')) {
    return invalid(email, 'Domínio sem extensão');
  }
  if (email.length > 254 || localPart.length > 64) {
    return invalid(email, 'E-mail excede o limite de tamanho');
  }
  if (
    !LOCAL_PART_PATTERN.test(localPart)
    || localPart.startsWith('.')
    || localPart.endsWith('.')
    || localPart.includes('..')
  ) {
    return invalid(email, 'Parte local contém caracteres ou formato inválido');
  }
  if (!DOMAIN_PATTERN.test(domain)) {
    return invalid(email, 'Domínio ou extensão inválidos');
  }

  return { email, status: 'válido', motivo: 'Sintaxe válida' };
}

async function validateEmail(email, { checkDns = false, mxResolver = resolveMx } = {}) {
  const syntaxResult = validateEmailSyntax(email);
  if (syntaxResult.status !== 'válido' || !checkDns) {
    return syntaxResult;
  }

  const domain = email.slice(email.lastIndexOf('@') + 1);
  try {
    const records = await mxResolver(domain);
    if (records.length === 0) {
      return invalid(email, 'Domínio não possui registro MX');
    }
    return { email, status: 'válido', motivo: 'Sintaxe e registro MX válidos' };
  } catch (error) {
    if (TEMPORARY_DNS_CODES.has(error.code)) {
      return {
        email,
        status: 'não verificado',
        motivo: 'Não foi possível verificar o DNS; sintaxe válida',
      };
    }
    if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
      return invalid(email, 'Domínio inexistente ou sem registro MX');
    }
    return {
      email,
      status: 'não verificado',
      motivo: 'Falha na consulta DNS; sintaxe válida',
    };
  }
}

async function validateEmails(emails, options) {
  if (!Array.isArray(emails)) {
    throw new TypeError('A lista de e-mails deve ser um array');
  }
  return Promise.all(emails.map((email) => validateEmail(email, options)));
}

module.exports = { validateEmail, validateEmailSyntax, validateEmails };