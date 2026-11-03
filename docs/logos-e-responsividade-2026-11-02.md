# Logos vetorizadas e responsividade — 02/11/2026

Registro da troca das logos pelas versões vetorizadas e da revisão de responsividade da landing page (dalmasstudio.com.br). As mudanças estão em `index.html`, `404.html` e `public/`; a pasta `docs/` não vai para o servidor (ver `docs/seo-2026-10-17.md`).

## 1. Logos

### Situação inicial

O navbar e o rodapé usavam `public/logo-dalmas-full.png` (314×201, tartaruga com o texto embaixo) com 32–40px de altura. Nesse tamanho o texto "DALMAS STUDIO" ficava com uns 5px, ilegível, e o PNG ficava borrado em telas de alta densidade.

### Arquivos

| Arquivo | Origem | Uso |
|---|---|---|
| `public/dalmas-tartaruga.svg` | Adicionado pelo dono | Navbar (`index.html` e `404.html`) |
| `public/dalmas-studio-logo-horizontal.svg` | Gerado a partir do logo completo | Rodapé |
| `public/dalmas-studio-logo-completo-2000px.png` | Adicionado pelo dono | `logo` e `image` do JSON-LD (`ProfessionalService`) |
| `public/dalmas-studio-logo-completo.svg` | Adicionado pelo dono | Base do logo horizontal; não usado direto na página |
| `public/dalmas-tartaruga-2000px.png`, `public/mascote-vetorizado.svg` | Adicionados pelo dono | Não usados |
| `public/logo-dalmas-full.png` | Antigo | Não usado pelo site (só pelos arquivos em `prototipos/`) |

**Como o logo horizontal foi montado:** o `dalmas-studio-logo-completo.svg` tem dois paths, `tartaruga` e `texto`. O logo horizontal reaproveita os dois, com as mesmas formas e degradês, e só reposiciona o texto ao lado da tartaruga com `transform`:

- altura do texto = 32% da altura da tartaruga (começou em 36% e foi reduzido a pedido);
- texto centralizado verticalmente no corpo da tartaruga (a 56% da altura, ignorando os enfeites do topo);
- `viewBox="0 0 911 156"`; ~111 KB, ~46 KB com gzip (o PNG antigo tinha 94 KB).

O script que gerou o arquivo não foi versionado. Se o logo completo mudar, é preciso montar o horizontal de novo e atualizar o `width="911"` do `<img>` do rodapé.

### Tamanhos

| Local | Celular | ≥768px | ≥1024px |
|---|---|---|---|
| Navbar (`.nav-brand img`) | 38px | 46px | 46px |
| Rodapé (`.footer-brand img`) | 40px | 40px | 48px |
| Navbar da 404 | 44px | 44px | 44px |

### Decisões (do dono do projeto)

- **Navbar só com a tartaruga**, sem texto, em todas as larguras.
- **Rodapé com o logo horizontal** (tartaruga + "DALMAS STUDIO" ao lado), com o texto um pouco menor que o primeiro teste.
- **`logo-dalmas-full.png` mantido** por enquanto: era o logo do JSON-LD e o Google pode ainda ter o endereço em cache.

## 2. Responsividade

### Como foi testado

Script com Playwright (usando o Chrome instalado) em 16 tamanhos de janela, incluindo notebooks com escala do Windows de 125% e 150%:

390×844 (celular), 768×1024 (iPad em pé), 800×700, 850×700, 900×700, 1024×650, 1280×600 (1080p a 150%), 1280×1024, 1366×650, 1440×780, 1536×730 (1080p a 125%), 1600×780, 1920×950, 2048×1000 (1440p a 125%), 2560×1300 e 3440×1300 (ultrawide).

Para cada tamanho foram medidos: rolagem horizontal, número de linhas do título do hero, se os botões do hero cabem na primeira dobra, posição à esquerda do logo, do hero, das seções, da faixa de CTA e do rodapé, largura do logo no navbar e espaço entre os links e o botão do WhatsApp.

### Problemas encontrados

| Problema | Onde | Causa |
|---|---|---|
| Navbar, faixa azul de CTA e rodapé desalinhados do conteúdo. Em 1920px o logo ficava 260px à esquerda do título; em 2560px a faixa de CTA tinha 2448px de largura contra 1400px do conteúdo | ≥1440px | Hero e seções têm `max-width: 1400px`; `.nav`, `.cta-wrap` e `.footer` não tinham |
| Título do hero quebrando em 5–6 linhas e botões fora da primeira dobra | 2048×1000 e maiores | O título podia chegar a 240px, mas a coluna tem no máximo 1288px úteis; acima de ~185px a última linha não cabe |
| Logo do navbar espremido (28px de largura em 768px) e links encostando no botão | 768–~830px | Logo, 7 links e botão não cabem na largura |
| Rodapé a 20px da borda, resto da página a 40px | 768–1023px | `.footer` não tinha padding próprio nesse breakpoint |

### Alterações em `index.html` (CSS)

- **`.nav` e `.footer` (≥1024px):** padding lateral `max(56px, calc((100% - 1400px) / 2 + 56px))`. O conteúdo fica alinhado à coluna de 1400px das seções, e o fundo e as linhas continuam de ponta a ponta.
- **`.cta-wrap`:** `max-width: 1400px; margin: 0 auto`.
- **Título do hero (desktop):** limite máximo de 240px para 182px (13% de 1400), sempre em 4 linhas. Substitui o limite descrito em `docs/hero-e-texto-2026-10-24.md`.
- **`.nav-links`:** aparecem a partir de 900px (antes, 768px). Abaixo disso o navbar mostra só o logo e o botão, como no celular.
- **`.footer` (≥768px):** padding lateral de 40px, igual ao resto da página.

### Botão "Falar no WhatsApp" do navbar (~15% menor, a pedido)

| | Antes | Depois |
|---|---|---|
| Celular | 13px, padding 10×16, 38px de altura | 11px, padding 9×14, 33px de altura |
| ≥768px | 14px, padding 14×22, 183×47 | 12px, padding 12×19, 158×41 |

Com o botão menor, o logo (46px) passou a definir a altura do navbar no desktop: 95px, e não mais 96px. O cálculo do hero (`100svh - 96px` e o `268px`) continua com 96. A diferença é de 1px, sem efeito visível.

O botão da `404.html` não foi alterado: ele usa a mesma classe (`.btn-primary`) do botão "Voltar para o início" da página.

## 3. Verificação

- Nos 16 tamanhos: título em 4 linhas, botões do hero na primeira dobra, sem rolagem horizontal, e logo, hero, seções, faixa de CTA e rodapé começando no mesmo ponto.
- Prints conferidos visualmente em 2560, 1920, 1366 e 768px (página inteira e primeira dobra).
- Logos conferidos de 320 a 1440px e na 404 (375 e 900px).
- JSON-LD continua válido.

**Não verificado:** aparelhos reais (só emulação no Chrome), Safari e Firefox.

Isto resolve a pendência "conferir o hero em celular e em resoluções de desktop maiores e menores" de `docs/hero-e-texto-2026-10-24.md`.

## 4. Pendências

- `public/og-image.png` (prévia de compartilhamento) ainda usa o logo antigo; gerar de novo com o novo.
- Botão do WhatsApp do navbar da 404 sem a redução de 15%.
- Apagar `public/logo-dalmas-full.png` quando não houver mais referência a ele (Google e `prototipos/`).
- Abaixo de 900px não há menu de navegação, só logo e botão. Se for necessário, falta um menu hambúrguer.
- Alterações ainda não commitadas.
