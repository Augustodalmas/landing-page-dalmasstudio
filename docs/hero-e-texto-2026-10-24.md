# Hero e texto de apresentação — 24/10/2026

Registro da remodelagem do hero da landing page (dalmasstudio.com.br) e da revisão do texto descritivo para SEO. Tudo foi feito em `index.html`; a pasta `docs/` não vai para o servidor (ver `docs/seo-2026-10-17.md`).

## 1. Ponto de partida

No desktop o hero não cabia na primeira tela: era preciso rolar para ver as métricas. A meta era ocupar 100% da altura da janela ao entrar no site.

## 2. Primeira tentativa: encaixar tudo na tela

Hero com `min-height` igual à altura da janela menos o menu (96px), conteúdo centralizado e título com tamanho limitado pela altura (`vh`). Funcionou, mas o título ficou pequeno demais, porque ainda dividia espaço com eyebrow, parágrafo e métricas.

## 3. Remodelagem do hero

Decisão: o hero fica **só com a frase de impacto e os dois botões**.

- Removidos do hero: eyebrow ("Para negócios locais que querem ser encontrados · Caxias do Sul, BR"), parágrafo descritivo e as quatro métricas.
- Título: no desktop (≥1024px de largura e ≥560px de altura) o tamanho é `min(13vw, (100svh − 268px) / 3.68)`, limitado a 240px. O 268px é menu (96) + padding (2×40) + botões (~92); o 3.68 são as 4 linhas × `line-height` 0.92. Com isso a frase cresce o máximo que cabe junto com os botões (126px em uma janela de 1528×732).
- Celular e tablet mantêm o tamanho anterior (`clamp(48px, 12vw, 144px)`).
- Animações de entrada: só o título e os botões; as do parágrafo e das métricas foram removidas, já que saíram da primeira tela.

## 4. Nova seção `#sobre`

O parágrafo e as métricas (100%, 1, <7, 3 anos) foram para uma seção logo abaixo do hero, antes de "Serviços". Título e parágrafo ficam centralizados; as métricas mantêm o alinhamento original.

## 5. Revisão de SEO do texto descritivo

Análise do texto antigo:

- Quatro ideias numa frase só, "hospedagem própria cobrada em mensalidade" soava como custo escondido e "diagnóstico em até 7 dias" não era explicado.
- O H1 é um slogan e não tem palavra-chave (site, sistema, Caxias do Sul); antes o parágrafo compensava isso no hero.
- Mensagem de hospedagem inconsistente: a meta description dizia "inclusa", o `og:description` e o FAQ diziam "via mensalidade".

Alterações:

- **H2 novo** na `#sobre`: "Sites e sistemas *sob medida* para pequenos negócios em Caxias do Sul".
- **Parágrafo novo:** "O Dalmas Studio cria landing pages e sistemas web feitos para o seu negócio, sem template. Em até 7 dias você recebe o diagnóstico do projeto, com preço fechado antes de começar. A hospedagem fica com a gente, em uma mensalidade fixa e sem surpresas."
- **Hospedagem alinhada** em "mensalidade fixa" na meta description e no JSON-LD (`ProfessionalService`). O `llms.txt` e o FAQ já diziam isso.
- O **H1 continua só o slogan**; a alternativa de uma linha de apoio acima dele foi descartada para não ocupar espaço no hero.

## 6. Desnichar o texto

Decisão: não restringir o posicionamento a salões, clínicas e lojas. `og:description` e `twitter:description` agora dizem: "Sites, landing pages e sistemas sob medida para o seu negócio. Preço fechado, hospedagem com mensalidade fixa e diagnóstico em até 7 dias."

Mantido de propósito: o projeto Dauth ("Agendamento para salões") no card de projetos e no `llms.txt`, por ser trabalho real do portfólio e não posicionamento do estúdio.

## 7. Verificação

Feita no Chrome com o site servido localmente (`python -m http.server`), em janelas de 1528×684 e 1528×732: hero sem rolagem, título e botões visíveis, `#sobre` com título e parágrafo centralizados e métricas abaixo.

Não verificado: outras resoluções de desktop (monitor grande, janela estreita perto de 1024px) e a versão mobile após a mudança. Vale abrir e conferir.

## 8. Pendências

- Conferir o hero em celular e em resoluções de desktop maiores e menores.
- Repetir o texto novo no `llms.txt` (hoje ele ainda usa a redação antiga, coerente em conteúdo mas não idêntica).
- Alterações ainda não commitadas.
