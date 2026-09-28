# playwright-e2e-framework

Framework E2E completo com **Playwright + TypeScript**, criado para demonstrar boas práticas de **QA Automation Enterprise** em um portfólio profissional.

## Visão geral do projeto

Este repositório entrega uma base pronta para produção com:

- **Playwright** para automação E2E moderna
- **TypeScript** para segurança de tipos e manutenção
- **Page Object Model (POM)** para separar regras de navegação e interação
- **Fixtures customizadas** para centralizar setup e dependências de teste
- **Data-driven testing** para ampliar cobertura sem duplicar lógica
- **Execução multi-browser** em Chromium, Firefox e WebKit
- **Captura automática de screenshots**, traces e vídeos em falhas
- **Relatórios HTML** para análise local e no CI
- **GitHub Actions** para integração contínua
- **ESLint + Prettier** para qualidade e padronização de código
- **Variáveis de ambiente** com `.env`

> Para tornar o portfólio executável de forma determinística, o projeto inclui uma **demo web app local** com fluxos reais de login, cadastro, busca e checkout.

## Tecnologias utilizadas

- Node.js
- Playwright
- TypeScript
- ESLint
- Prettier
- GitHub Actions
- HTML/CSS/JavaScript (demo app local)

## Arquitetura

```text
playwright-e2e-framework/
├── .github/workflows/        # Pipeline CI/CD
├── app/                      # Aplicação demo local para os fluxos E2E
├── config/                   # Ambiente e rotas
├── data/                     # Massa de dados reutilizável
├── fixtures/                 # Fixtures Playwright customizadas
├── pages/                    # Page Objects
├── tests/                    # Especificações E2E
├── utils/                    # Helpers, anexos e servidor local
├── playwright.config.ts      # Configuração principal do Playwright
├── tsconfig.json             # Configuração do TypeScript
├── eslint.config.mjs         # Regras de lint
├── .env.example              # Exemplo de variáveis de ambiente
└── README.md
```

### Padrões adotados

- **POM por contexto funcional**: cada fluxo possui uma classe dedicada em `pages/`
- **Selectors estáveis**: preferência por `getByRole`, `getByLabel` e `data-testid`
- **Fixtures compostas**: injeção de Page Objects + massa de dados por suíte
- **Hooks beforeEach/afterEach**: reset previsível do estado e anexos úteis em falhas
- **Assertions robustas**: validação de URL, headings, feedbacks, carrinho e confirmação de pedido
- **Data-driven tests**: iteração sobre datasets de login, cadastro e busca

## Fluxos reais implementados

1. **Login E2E**
   - sucesso com usuário seed
   - bloqueio com credenciais inválidas
2. **Cadastro de usuário**
   - criação de nova conta com autenticação automática
3. **Fluxo de Checkout**
   - login, adição de itens, carrinho, resumo e confirmação do pedido
4. **Busca de produtos**
   - filtro por nome e categoria em cenários data-driven

## Como executar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Instalar os browsers do Playwright

```bash
npx playwright install --with-deps
```

### 3. Configurar ambiente

```bash
cp .env.example .env
```

### 4. Executar a suíte completa

```bash
npm test
```

### 5. Executar apenas smoke tests

```bash
npm run test:smoke
```

### 6. Abrir o relatório HTML

```bash
npm run test:report
```

## Como executar no CI/CD

O workflow em `.github/workflows/playwright.yml` realiza automaticamente:

1. checkout do repositório
2. instalação das dependências
3. instalação dos browsers Playwright
4. lint e typecheck
5. execução dos testes E2E
6. publicação dos artefatos `playwright-report/` e `test-results/`

## Evidências de execução

Ao final dos testes, o projeto gera:

- **HTML Report** em `playwright-report/`
- **Screenshots automáticos** em falhas
- **Trace Viewer** para debug avançado
- **Vídeos** em cenários com erro
- **Anexos extras** com DOM snapshot e estado do `localStorage`

## Scripts úteis

```bash
npm run lint
npm run typecheck
npm run test
npm run test:smoke
npm run test:headed
npm run test:ui
npm run test:report
npm run validate
```

## Boas práticas adotadas

- configuração centralizada via `config/env.ts`
- isolamento de estado entre testes
- massa de dados versionada em `data/`
- reutilização por fixtures e helpers
- foco em legibilidade, escalabilidade e manutenção
- pipeline CI pronta para times distribuídos

## Credenciais seed da demo

- **E-mail:** `qa@example.com`
- **Senha:** `Secret123!`

Essas credenciais também podem ser sobrescritas com variáveis de ambiente para facilitar experimentação local.
