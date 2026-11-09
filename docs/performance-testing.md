# Testes de performance

## Plano

`performance/plans/blazedemo-load-mix.jmx` executa dois fluxos na mesma Thread Group: busca de voos em 80% das execuções de cenário e compra completa em 20%. A distribuição do Throughput Controller se aplica a execuções de cenário, não ao número bruto de requests HTTP, pois cada fluxo tem quantidades diferentes de requests.

Os arquivos `performance/data/flight-search.csv` e `performance/data/flight-booking.csv` fornecem os dados parametrizados. O plano extrai `flight`, `price` e `airline` da primeira opção de voo retornada, e usa esses valores no passo de reserva. Os dados de cartão são fictícios e servem somente para o ambiente demonstrativo.

## Execução

Execute a partir da raiz do repositório, com JMeter 5.6.3 ou compatível instalado:

```powershell
New-Item -ItemType Directory -Force performance/reports | Out-Null
jmeter -n -t performance/plans/blazedemo-load-mix.jmx -l performance/reports/blazedemo.jtl -e -o performance/reports/html
```

Exemplo de perfil local de curta duração:

```powershell
jmeter -n -t performance/plans/blazedemo-load-mix.jmx -Jthreads=2 -JrampUp=5 -Jduration=30 -l performance/reports/smoke.jtl -e -o performance/reports/smoke-html
```

O diretório informado em `-o` deve ser novo ou estar vazio; use outro nome para cada execução. `-Jhost`, `-JconnectTimeout`, `-JresponseTimeout`, `-JsearchData` e `-JbookingData` permitem substituir host, timeouts e caminhos dos CSVs.

Abra `index.html` no diretório de relatório HTML para consultar os gráficos e tabelas. Para análise de resultados, use:

- **Tempo médio:** média aritmética dos tempos de resposta; observe também mediana e percentis, pois a média pode ocultar caudas longas.
- **Throughput:** amostras concluídas por unidade de tempo. Compare com a carga oferecida e monitore saturação do gerador e do alvo.
- **P90, P95 e P99:** limites abaixo dos quais se encontram 90%, 95% e 99% das respostas. P95/P99 são úteis para identificar degradação percebida por uma parcela dos usuários.
- **Taxa de erros:** proporção de amostras com falha HTTP, assertion ou erro de transporte. Correlacione com latência e volume antes de atribuir causa.

Não há resultados de carga publicados: JMeter não está instalado neste ambiente e nenhum teste de performance foi executado. O site público é externo e não há autorização ou capacidade contratual para submeter carga; execute apenas com limites aprovados pelo responsável pelo alvo.