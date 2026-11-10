# QA Challenge Senior

Projeto desenvolvido para um desafio técnico de QA Sênior. Reúne testes automatizados de API e interface, um validador de e-mails, um plano de desempenho com JMeter e especificações de cenários em Gherkin.

## Tecnologias

- Node.js 20 ou superior e npm.
- TypeScript e Playwright Test 1.65.
- Node.js `node:test` para os testes do validador de e-mails.
- Apache JMeter 5.6.3 ou compatível para o plano de desempenho.
- Gherkin para especificações BDD.

## Instalação

Na raiz do repositório, instale as dependências e o navegador usado pelos testes E2E:

```powershell
npm ci
npx playwright install chromium
```

Os testes de API e E2E acessam serviços públicos e precisam de conexão à internet. O JMeter e o Java são necessários apenas para executar o plano de desempenho.

## Como executar

### Testes automatizados

```powershell
npm run test:api
npm run test:e2e
npm run test:email
```

`npm test` executa os testes Playwright de API e E2E. Os testes do validador de e-mails são executados separadamente com `npm run test:email`.

Para executar um teste E2E específico:

```powershell
npx playwright test tests/e2e/specs/login.spec.ts
```

Para gerar o CSV de validação a partir da lista de exemplo:

```powershell
npm run email:validate
```

O arquivo gerado `email-validator/validacao_emails.csv` é ignorado pelo Git. A consulta DNS/MX é opcional; veja as opções da CLI antes de usá-la.

### Desempenho

O plano JMeter, os dados de entrada, os comandos de execução e as observações sobre resultados estão em [docs/performance-testing.md](docs/performance-testing.md). É necessário ter Java e JMeter instalados.

Execute testes de carga somente em sistemas autorizados, com escopo e limites aprovados pelo responsável. Relatórios locais do JMeter ficam em `performance/reports/` e não são versionados.

## Estrutura do projeto

```text
.
├── bdd-scenarios/       # Especificações Gherkin e priorização de CI/CD
├── docs/                # Respostas teóricas e documentação de desempenho
├── email-validator/     # CLI, validador, CSV e testes unitários
├── performance/
│   ├── data/            # Dados CSV de busca e reserva
│   ├── plans/           # Plano JMeter
│   └── reports/         # Relatórios locais gerados (ignorados pelo Git)
└── tests/
    ├── api/             # Testes de API
    └── e2e/
        ├── fixtures/    # Fixtures compartilhadas
        ├── pages/       # Page Objects
        └── specs/       # Cenários E2E
```

## Observações para avaliação

- Os testes de API usam a DummyJSON. A API simula algumas operações de escrita e não persiste todos os dados criados; as verificações refletem esse comportamento observado.
- Os testes E2E usam o SauceDemo público e credenciais de demonstração.
- Os cenários PayPal em `bdd-scenarios/` são especificações, não testes executáveis. A US-042 e seus critérios de aceite não foram incluídos no material disponível.
- As respostas teóricas estão em [docs/theory-answers.md](docs/theory-answers.md). A questão 20 foi respondida considerando dois cenários comuns, pois as descrições originais não estavam disponíveis; recomenda-se conferir essa interpretação com o enunciado recebido.
- Relatórios do Playwright, resultados do JMeter, dependências instaladas e arquivos gerados localmente são ignorados pelo Git.

## Relatórios

Após executar os testes Playwright, abra o relatório HTML com:

```powershell
npx playwright show-report playwright-report
```

Os diretórios `playwright-report/` e `test-results/` são locais e não são enviados ao repositório.
