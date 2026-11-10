# QA Challenge Senior

Implementação técnica para o desafio de Analista de Qualidade de Software Sênior, com automação de API e web, validação de e-mails, plano de performance e especificações BDD.

## Objetivos

- Exercitar validação de contratos REST e o comportamento real de uma API simulada.
- Automatizar fluxos críticos de login, catálogo, carrinho e checkout com Playwright e Page Object Model.
- Validar listas de e-mails e produzir CSV rastreável.
- Preparar um plano de carga JMeter parametrizado para o BlazeDemo.
- Modelar cenários de pagamento PayPal em Gherkin, incluindo falhas assíncronas e concorrência.

## Tecnologias

- Node.js 20 ou superior e npm.
- TypeScript e Playwright Test 1.65.
- Node.js `node:test` para os testes do validador.
- Apache JMeter 5.6.3 ou compatível para os planos de performance.
- Gherkin em português para as especificações BDD.

## Estrutura

```text
qa-challenge-senior/
├── bdd-scenarios/
│   ├── paypal-payment.feature
│   └── priorizacao-ci-cd.md
├── docs/
│   ├── performance-testing.md
│   └── theory-answers.md
├── email-validator/
│   ├── cli.js
│   ├── csv-writer.js
│   ├── validator.js
│   └── validator.test.js
├── performance/
│   ├── data/
│   └── plans/
├── test-results/
└── tests/
	├── api/
	└── e2e/
		├── fixtures/
		├── pages/
		└── specs/
```

## Instalação

```powershell
npm ci
npx playwright install chromium
```

O JMeter é opcional para as demais partes. Para abrir/executar o plano de performance no Windows, instale Java e Apache JMeter 5.6.3 ou compatível. A instalação do JMeter não foi necessária para criar o plano.

## Testes de API

Os testes chamam `https://dummyjson.com` diretamente:

```powershell
npm run test:api
```

Cobrem criação e consulta de produtos, criação/consulta/exclusão de carrinhos, tipos e totais, IDs inexistentes ou malformados e os efeitos simulados de escrita. A DummyJSON não persiste os produtos ou carrinhos recém-criados; os testes verificam esse comportamento observado e usam produtos do catálogo para validar cálculos de carrinho. A criação simulada de produto aceita campos ausentes e valores inválidos, enquanto a criação de carrinho sem dados retorna `400`; os testes registram essas diferenças em vez de presumir validações uniformes.

## Testes E2E

Os Page Objects e specs usam o SauceDemo público:

```powershell
npm run test:e2e
```

Para executar um arquivo ou cenário isolado:

```powershell
npx playwright test tests/e2e/specs/login.spec.ts
npx playwright test tests/e2e/specs/checkout.spec.ts -g "completes an order"
```

Os testes não usam sleeps; o Playwright aguarda automaticamente locators, navegação e assertions.

## Validador de e-mails

Execute os testes unitários e depois gere `email-validator/validacao_emails.csv` usando `email-validator/emails.txt`:

```powershell
npm run test:email
npm run email:validate
```

O CSV contém `email,status,motivo`, usa UTF-8 com BOM e trata lista vazia. Também é possível informar caminhos próprios:

```powershell
node email-validator/cli.js --input .\emails.txt --output .\resultado.csv
node email-validator/cli.js --check-dns
```

A checagem DNS/MX é opcional; erros temporários de rede são registrados como `não verificado`, sem interromper a geração do CSV.

## Performance

O plano de mistura 80/20, os dados CSV, os comandos non-GUI e a interpretação dos indicadores estão em [docs/performance-testing.md](docs/performance-testing.md). Há uma execução local registrada em `performance/reports/`, mas esses resultados são ignorados pelo Git; consulte a documentação antes de citá-los. A execução não substitui autorização nem critérios de carga aprovados pelo responsável pelo alvo.

## BDD e requisitos pendentes

Os cenários PayPal estão em `bdd-scenarios/paypal-payment.feature`; a estratégia de priorização está em `bdd-scenarios/priorizacao-ci-cd.md`. São especificações, não automação executável: não há aplicação PayPal ou integração disponibilizada.

O documento original do desafio, incluindo a US-042 e seus critérios de aceite, não foi encontrado no repositório. Os cenários foram derivados apenas dos requisitos fornecidos na solicitação e devem ser revisados quando a US-042 estiver disponível. As respostas da Parte 1 estão em `docs/theory-answers.md`; algumas questões foram fornecidas de forma resumida e a questão 20 não inclui a descrição dos dois cenários, portanto esses trechos devem ser conferidos com o enunciado original antes da entrega.

## Relatórios e artefatos

- Playwright grava resultados e traces em `test-results/playwright/` e o relatório HTML em `playwright-report/`.
- Abra o relatório Playwright com `npx playwright show-report playwright-report` após executar os testes.
- O CSV gerado é ignorado pelo Git; a lista de entrada `emails.txt` é versionável.
- JMeter grava `.jtl` e HTML em `performance/reports/`, também ignorado pelo Git.

## Decisões técnicas

- API: assertions refletem respostas reais observadas da DummyJSON, inclusive IDs simulados e ausência de persistência.
- E2E: autenticação comum é isolada em fixture; locators usam `data-test` e os Page Objects concentram as interações.
- E-mail: validação sintática e DNS são separadas; geração CSV escapa aspas e campos com vírgula.
- Performance: os fluxos usam controladores percentuais, CSV Data Set Config e correlação de voo com valores extraídos da resposta.
- BDD: nenhuma chamada ou integração fictícia foi criada para o PayPal.
