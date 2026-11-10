# Parte 1 — Respostas teóricas

As respostas abaixo acompanham as questões recebidas e foram organizadas para facilitar a avaliação. As questões 20, 25, 26 e 27 foram fornecidas de forma resumida; na questão 20, em particular, não vieram as descrições dos dois cenários. As respostas correspondentes consideram apenas as informações disponíveis e devem ser conferidas com o enunciado original antes da entrega final.

## Questão 1 — Qual é o principal objetivo da análise de risco no processo de teste?

Identificar, avaliar e priorizar riscos do produto para direcionar os testes às áreas com maior probabilidade e impacto de falha. O objetivo é reduzir o risco residual a um nível aceitável para o negócio, não eliminá-lo por completo.

## Questão 2 — O que é um teste baseado em requisitos? Cite exemplos.

É o teste derivado dos requisitos funcionais e não funcionais, das histórias de usuário e dos critérios de aceite. Ele verifica se o comportamento observado corresponde ao que foi especificado.

Exemplos:

- Confirmar que o sistema permite o login com credenciais válidas e rejeita credenciais inválidas.
- Verificar se o checkout atende ao tempo de resposta definido no requisito de desempenho.
- Confirmar que a pessoa usuária recebe a comunicação de confirmação após uma compra concluída.

## Questão 3 — O que é um teste unitário e quem os realiza? Cite exemplos.

É um teste de uma unidade pequena de código — como uma função ou método — executada de forma isolada de dependências externas, que costumam ser simuladas quando necessário.

É mais comum que desenvolvedores escrevam e mantenham testes unitários, mas a responsabilidade pode variar conforme a organização e o papel do QA.

Exemplos:

- Verificar se `calcularDesconto(preco, percentual)` retorna o valor esperado.
- Confirmar que `validarCPF()` rejeita entradas inválidas.
- Testar as regras de emissão de token de um serviço de autenticação, isolando as dependências externas.

## Questão 4 — O que é um teste de integração e quem o realiza? Cite exemplos.

É o teste que verifica a interação entre componentes, módulos ou sistemas e se os dados e resultados são tratados corretamente entre eles. Pode ser realizado por desenvolvedores, QAs ou em colaboração, de acordo com a estratégia do time.

Exemplos:

- Verificar a integração entre a interface e a API de autenticação.
- Testar a comunicação entre o sistema de pedidos e o gateway de pagamento.
- Validar a troca de dados entre serviços de pedido, estoque e entrega.

## Questão 5 — Como você abordaria os testes de desempenho de uma aplicação web que calcula rotas para uma operação com 20 milhões de entregas por dia? Quais conceitos e tipos de teste consideraria?

Eu começaria entendendo a carga real e os objetivos de serviço: distribuição horária e geográfica das entregas, quantidade de cálculos de rota por entrega, concorrência, sazonalidade, dependências externas e metas de latência e disponibilidade. Vinte milhões de entregas por dia equivalem a cerca de 231 entregas por segundo em média, mas essa média não representa os picos nem necessariamente a taxa de requisições ao serviço de rotas. A carga do teste deve ser estimada com dados operacionais e critérios acordados com o negócio.

Conceitos e métricas importantes:

- **Latência e percentis:** tempo de resposta médio e, especialmente, P90/P95/P99.
- **Throughput:** requisições ou cálculos concluídos por unidade de tempo.
- **Concorrência:** quantidade de solicitações simultâneas.
- **Capacidade e escalabilidade:** comportamento ao aumentar a carga e os recursos.
- **Estabilidade e recuperação:** comportamento durante carga prolongada e após falhas.
- **Uso de recursos:** CPU, memória, rede, banco de dados e serviços dependentes.
- **Taxa de erros:** falhas funcionais, timeouts e erros de infraestrutura.

Tipos de teste que eu consideraria:

- **Carga:** validar a carga esperada e os picos previstos.
- **Estresse:** ultrapassar gradualmente a carga esperada para identificar limites e comportamento de degradação.
- **Pico (spike):** avaliar aumentos súbitos de tráfego.
- **Resistência (soak/endurance):** manter carga por período prolongado para identificar degradação ou vazamento de recursos.
- **Volume:** avaliar grandes volumes de dados, como histórico de rotas e entregas.

Os testes devem ocorrer em ambiente autorizado e representativo, com limites de carga, critérios de parada e monitoramento definidos.

## Questão 6 — O que são CI e CD (Continuous Integration e Continuous Delivery/Deployment)? Cite exemplos práticos aplicados ao QA.

- **Integração contínua (CI):** integração frequente de alterações ao repositório, com build e verificações automatizadas para detectar problemas cedo.
- **Entrega contínua (Continuous Delivery):** manutenção do software em condição de ser liberado, com etapas de validação e aprovação antes da produção.
- **Implantação contínua (Continuous Deployment):** publicação automática em produção quando as verificações e regras definidas são atendidas.

Exemplos aplicados ao QA:

- Executar testes unitários, de API e smoke a cada pull request.
- Rodar testes de regressão selecionados após a publicação em homologação.
- Bloquear a promoção de uma versão quando verificações críticas falharem.
- Publicar resultados e evidências no pipeline para feedback rápido ao time.

## Questão 7 — Qual tipo de teste foca no comportamento interno do software?

O **teste de caixa-branca** (ou teste estrutural), que considera a estrutura interna do código, como condições, caminhos e cobertura de linhas ou ramificações.

## Questão 8 — Qual tipo de teste foca no comportamento externo do software?

O **teste de caixa-preta**, que verifica entradas e saídas observáveis sem depender do conhecimento da implementação interna.

## Questão 9 — Cite a importância dos testes exploratórios.

Testes exploratórios combinam aprendizado, desenho e execução de testes. São úteis para investigar áreas pouco conhecidas, requisitos incompletos e comportamentos não previstos em casos roteirizados. Complementam os testes formais e automatizados, aproveitando a observação e o raciocínio crítico de quem testa. As descobertas devem ser registradas para permitir reprodução e acompanhamento.

## Questão 10 — Quais são os benefícios da automação de testes funcionais?

- Repetir verificações de forma consistente, especialmente em regressões.
- Obter feedback mais rápido após mudanças.
- Executar verificações frequentes em pipelines de CI/CD.
- Reduzir trabalho manual repetitivo e liberar tempo para investigação e testes exploratórios.
- Aumentar a cobertura de cenários repetíveis, desde que os testes sejam confiáveis e mantidos.

A automação não substitui todos os testes manuais e tem custos de criação e manutenção.

## Questão 11 — Em qual etapa do projeto o QA deve ser envolvido?

Desde o início, idealmente durante o refinamento de requisitos e critérios de aceite, e ao longo de design, desenvolvimento e entrega. A participação antecipada ajuda a esclarecer ambiguidades, antecipar riscos e reduzir retrabalho.

## Questão 12 — Como manter um trabalho ágil como um todo?

- Colaborar continuamente entre QA, desenvolvimento, produto e demais áreas.
- Participar de planejamento, alinhamentos, revisões e retrospectivas de forma objetiva.
- Entregar valor em incrementos pequenos e verificáveis.
- Adaptar prioridades conforme riscos, feedback e mudanças.
- Tornar impedimentos e resultados visíveis ao time.
- Manter documentação suficiente e atualizada, sem burocracia desnecessária.

## Questão 13 — Na sua visão, a qualidade do software é responsabilidade apenas do QA? Justifique.

Não. A qualidade é responsabilidade compartilhada pelo time e pela organização. Desenvolvimento contribui com código e testes; produto ajuda a definir necessidades e critérios claros; QA contribui com análise de risco, estratégia, investigação e evidências. QA não deve ser tratado como o único responsável por encontrar todos os defeitos ao final do processo.

## Questão 14 — Indique formas de executar testes não funcionais e explique sua importância.

Algumas formas incluem:

- **Desempenho:** ferramentas como JMeter, k6, Gatling ou Locust.
- **Segurança:** análise estática e de dependências, além de testes dinâmicos autorizados com ferramentas como OWASP ZAP ou Burp Suite.
- **Acessibilidade:** verificações automatizadas com axe ou Lighthouse, complementadas por avaliação manual.
- **Usabilidade:** sessões com pessoas usuárias e tarefas representativas.
- **Compatibilidade:** testes em navegadores, dispositivos e ambientes relevantes.

Esses testes avaliam atributos além da funcionalidade, como desempenho, segurança, acessibilidade e compatibilidade. A seleção deve considerar riscos, requisitos e contexto do produto; ferramentas ajudam, mas não substituem análise humana.

## Questão 15 — Indique maneiras de dar visibilidade às tarefas de QA para o time.

- Manter um board compartilhado com responsáveis, status e impedimentos.
- Comunicar progresso, riscos e bloqueios nas cerimônias do time.
- Publicar resultados de testes e evidências em local acessível.
- Usar métricas contextualizadas, como execução e resultado de testes, defeitos relevantes e riscos ainda abertos.
- Registrar decisões e próximos passos de forma clara.

Métricas devem apoiar decisões, não ser tratadas isoladamente como medida de qualidade.

## Questão 16 — Explique as vantagens dos testes manuais e automatizados, com exemplos e benefícios.

| Abordagem | Vantagens | Exemplos de aplicação | Benefícios |
|---|---|---|---|
| Manual | Flexibilidade para explorar o sistema e avaliar a experiência do ponto de vista da pessoa usuária. | Testes exploratórios, testes de usabilidade e avaliação inicial de uma funcionalidade. | Ajuda a identificar problemas inesperados e aspectos da experiência que são difíceis de verificar automaticamente. |
| Automatizada | Execução rápida, repetível e consistente. | Testes de regressão, smoke tests e verificações de API. | Acelera o feedback e permite executar verificações com frequência, inclusive em pipelines de CI/CD. |

As abordagens são complementares. A automação é mais adequada para verificações repetíveis e estáveis; testes manuais são valiosos quando exploração, julgamento e observação humana são importantes.

## Questão 17 — Como a IA pode colaborar com os testes de software? Cite exemplos do dia a dia.

A IA pode auxiliar na geração de ideias de cenários e dados de teste a partir de requisitos, na análise de logs e falhas, na priorização de testes com base em risco e histórico e na identificação de diferenças visuais. Também pode apoiar a escrita e revisão de scripts.

Essas sugestões precisam ser verificadas por pessoas: podem estar incorretas, incompletas ou não refletir o comportamento esperado. Dados sensíveis e código também devem ser tratados conforme as políticas de segurança da organização.

## Questão 18 — Cite exemplos da importância da rastreabilidade nos testes.

- Relacionar requisitos e critérios de aceite aos testes que os verificam.
- Ligar defeitos aos testes e requisitos relacionados para facilitar análise de impacto.
- Identificar quais verificações precisam ser revistas quando um requisito muda.
- Apoiar auditorias e demonstrar evidências em contextos regulados.
- Comunicar cobertura, lacunas e riscos às partes interessadas.

## Questão 19 — Na sua visão, quando os testes são suficientes?

Não existe teste que prove a ausência absoluta de defeitos. A evidência de teste é suficiente para uma decisão de entrega quando os critérios de aceite e saída foram atendidos, os riscos relevantes foram avaliados e o risco residual foi comunicado e aceito pelas pessoas responsáveis pelo negócio. A decisão deve considerar também defeitos conhecidos, limitações de cobertura e resultados em ambientes representativos.

## Questão 20 — Considerando dois cenários não ideais, qual é o pior e por quê? Como você atuaria para resolver?

Considerando dois cenários comuns:

1. **Capacidade de QA insuficiente:** há poucas pessoas de QA para o volume de trabalho, mas as entregas de desenvolvimento acontecem de forma contínua ao longo da sprint.
2. **Entrega concentrada no fim da sprint:** a equipe de QA tem capacidade suficiente, mas o desenvolvimento só disponibiliza as funcionalidades para teste perto do encerramento da sprint.

Na minha avaliação, o **segundo cenário é o mais prejudicial**. Mesmo com capacidade de QA adequada, concentrar as entregas no fim reduz o tempo para testar, corrigir e repetir os testes. Isso cria um gargalo, atrasa o feedback e aumenta o risco de defeitos escaparem ou de a sprint terminar sem que a funcionalidade esteja validada. No primeiro cenário também há risco, mas a equipe pode priorizar por impacto e probabilidade, negociar escopo e buscar apoio do time enquanto trabalha em melhorias de capacidade.

Eu atuaria junto ao time para:

- Entender as causas das entregas tardias e visualizar onde o fluxo está sendo bloqueado.
- Dividir o trabalho em incrementos menores e disponibilizá-los para validação assim que estiverem prontos.
- Definir critérios de pronto compartilhados, incluindo verificações de qualidade e colaboração entre desenvolvimento e QA.
- Envolver QA desde o refinamento, esclarecendo riscos e critérios de aceite antes da implementação.
- Automatizar verificações repetitivas e manter um ambiente de teste disponível, quando apropriado.
- Acompanhar na retrospectiva indicadores como tempo de espera por testes, retrabalho e defeitos encontrados tarde, e avaliar se as mudanças melhoraram o fluxo.

## Questão 21 — Diferencie teste estático e dinâmico.

- **Estático:** avalia artefatos sem executar o software, por exemplo, revisão de requisitos ou código e análise estática.
- **Dinâmico:** executa o software com entradas para observar e avaliar seu comportamento, como em testes funcionais ou de desempenho.

## Questão 22 — Diferencie teste alfa e beta.

- **Teste alfa:** realizado antes da versão ser disponibilizada ao público, em ambiente controlado e com participação da equipe interna, como QA e desenvolvimento, ou de um grupo selecionado. Seu objetivo é identificar problemas e validar o produto antes de expô-lo a usuários externos.
- **Teste beta:** realizado por um grupo de usuários ou clientes externos, em condições próximas às de uso real, antes do lançamento amplo ou durante uma liberação limitada. Seu objetivo é obter feedback e identificar problemas que podem não surgir no ambiente controlado de alfa.

Em geral, o teste alfa acontece antes do beta, embora os detalhes possam variar conforme o processo de lançamento.

## Questão 23 — O que é Splunk? Pode ser usado por QAs? Cite exemplos práticos.

Splunk é uma plataforma usada para pesquisar, analisar e visualizar logs e outros dados operacionais. QAs podem utilizá-la, conforme o acesso e as políticas da organização, para:

- Investigar erros em ambientes de teste ou produção.
- Verificar se eventos esperados foram registrados.
- Correlacionar falhas com horários, versões e componentes.
- Acompanhar métricas e alertas durante testes autorizados.

## Questão 24 — Cite exemplos de como a AWS ou outros serviços de nuvem podem ser usados no trabalho de QA.

- Criar ambientes de teste sob demanda com serviços de computação, como EC2, ECS ou EKS.
- Armazenar relatórios e evidências em S3 com as permissões adequadas.
- Consultar logs e métricas com CloudWatch.
- Validar integrações que utilizem serviços como SQS, Lambda e API Gateway.
- Executar etapas de build e testes em pipelines, por exemplo, com CodeBuild e CodePipeline.
- Dimensionar geradores de carga temporários para testes autorizados, controlando custo e limites.

## Questão 25 — Dê um exemplo de comando para executar um teste de desempenho pela linha de comando.

Um exemplo é o **ApacheBench (`ab`)**, ferramenta de linha de comando para medir o desempenho de um servidor HTTP:

```bash
ab -n 100 -c 5 http://localhost:8080/
```

Nesse exemplo, `-n 100` define o total de requisições e `-c 5` limita a cinco as requisições simultâneas. O endereço é local para ilustrar o uso; em um teste real, escolha uma carga compatível com o ambiente e execute somente contra sistemas sob sua responsabilidade ou com autorização explícita. O ApacheBench é adequado para medições simples de um endpoint, mas não representa por si só fluxos completos de usuários.

## Questão 26 — Entre um programa de TV com vários patrocinadores e uma indústria automobilística, qual cliente necessita mais de testes de desempenho e por quê?

Não é possível concluir apenas pelo setor: ambos podem ter necessidades críticas de desempenho. Eu compararia o perfil de tráfego, os picos previstos, os serviços envolvidos, os objetivos de resposta e o impacto de uma falha.

Por exemplo, um programa com transmissão ao vivo pode enfrentar picos concentrados e imprevisíveis em votações, inscrições ou acesso a conteúdo. Uma indústria automobilística pode ter picos em campanhas e lançamentos, além de sistemas operacionais cuja lentidão afete processos importantes. Eu priorizaria o cliente com maior risco e impacto demonstráveis, definindo os cenários de teste a partir de dados e requisitos de negócio.

## Questão 27 — Como você atuaria se a empresa demonstrasse grande resistência à automação de testes?

Eu começaria entendendo as preocupações do time — como custo, manutenção ou falta de experiência — e proporia um piloto pequeno, com objetivo e critérios de sucesso definidos.

1. Selecionar poucos testes críticos, repetitivos e estáveis.
2. Medir o esforço atual e comparar com o tempo de execução e manutenção da automação.
3. Demonstrar resultados e limitações com transparência.
4. Envolver QA e desenvolvimento na escolha da ferramenta e na manutenção.
5. Expandir gradualmente se houver benefício comprovado.

A automação deve resolver um problema real e não ser adotada apenas para aumentar uma métrica de cobertura.

## Questão 28 — O que é teste de confiabilidade?

É a avaliação da capacidade do sistema de operar de maneira consistente durante um período e sob condições definidas. Pode incluir observação de falhas, disponibilidade, comportamento após recuperação e degradação ao longo do tempo.

## Questão 29 — O que é teste de portabilidade?

É a avaliação da capacidade do software de ser transferido ou executado corretamente em diferentes ambientes relevantes, como sistemas operacionais, navegadores, dispositivos ou configurações.

## Questão 30 — O que é teste de segurança?

É a avaliação de controles e comportamentos do sistema para identificar riscos de segurança, como falhas de autenticação ou autorização, exposição indevida de dados e vulnerabilidades de entrada. O objetivo é proteger confidencialidade, integridade e disponibilidade. Os testes devem ser realizados apenas em sistemas e ambientes autorizados, com escopo e limites definidos.
