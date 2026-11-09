const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { writeCsv } = require('./csv-writer');
const { validateEmails } = require('./validator');

function parseArguments(args) {
  const options = {
    input: path.join(__dirname, 'emails.txt'),
    output: path.join(__dirname, 'validacao_emails.csv'),
    checkDns: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--check-dns') {
      options.checkDns = true;
    } else if (args[index] === '--input' || args[index] === '--output') {
      const option = args[index];
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Informe um caminho após ${option}`);
      }
      options[option === '--input' ? 'input' : 'output'] = path.resolve(value);
      index += 1;
    } else {
      throw new Error(`Opção desconhecida: ${args[index]}`);
    }
  }

  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const contents = await readFile(options.input, 'utf8');
  const emails = contents.split(/\r?\n/).filter((line) => line.length > 0);
  const results = await validateEmails(emails, { checkDns: options.checkDns });
  await writeCsv(options.output, results);
  console.log(`CSV gerado: ${options.output} (${results.length} e-mails)`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});