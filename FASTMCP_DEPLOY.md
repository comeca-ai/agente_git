# 🚀 Deploy no FastMCP - Bible Daily App

Este guia mostra como fazer deploy do servidor MCP seguindo as **guidelines FastMCP**.

## 📋 O que é FastMCP Style?

FastMCP é uma abordagem de design para servidores MCP que prioriza:

✅ **1 tool = 1 intention** (clara e focada)  
✅ **Schemas explícitos** com Zod  
✅ **Respostas enxutas** e previsíveis  
✅ **Sem tools "do_everything"**  
✅ **UX nativa** do ChatGPT

## 🏗️ Arquitetura FastMCP

```
biblia-diaria-mcp/
├── server/
│   ├── src/
│   │   ├── index-fastmcp.ts   # ✅ Servidor FastMCP (3 tools claras)
│   │   └── bible-data.ts       # Dados (separado)
│   └── dist/                   # Build output
├── package.json
└── tsconfig.json
```

## 🎯 Tools Implementadas (FastMCP Style)

### 1. `obter_versiculo_diario`
**Intenção:** Inspiração diária  
**Parâmetros:** Nenhum  
**Retorno:** Versículo aleatório formatado

### 2. `obter_versiculo_por_livro`
**Intenção:** Buscar em livro específico  
**Parâmetros:** `livro: string`  
**Retorno:** Versículo do livro especificado

### 3. `listar_livros_disponiveis`
**Intenção:** Descobrir o que está disponível  
**Parâmetros:** Nenhum  
**Retorno:** Lista de todos os livros

## 🔧 Build do Servidor

```bash
# 1. Instalar dependências
npm install

# 2. Build do servidor FastMCP
npm run build:server

# 3. Verificar arquivos compilados
ls server/dist/
# Saída esperada: index-fastmcp.js, bible-data.js
```

## 📦 Deploy no FastMCP Cloud

### Opção 1: Deploy via CLI (quando disponível)

```bash
# 1. Instalar CLI do FastMCP (futuro)
npm install -g fastmcp-cli

# 2. Fazer login
fastmcp login

# 3. Deploy do servidor
fastmcp deploy server/dist/index-fastmcp.js \
  --name biblia-diaria \
  --version 1.0.0

# 4. Verificar status
fastmcp status biblia-diaria
```

### Opção 2: Deploy em Cloud Providers

Para apps que precisam estar sempre online:

**Railway / Render:**
1. Conecte repositório Git
2. Configure build: `npm run build:server`
3. Configure start: `node server/dist/index-fastmcp.js`
4. Deploy automático!

**AWS Lambda / Cloud Functions:**
Ideal para serverless com baixo tráfego.

**VPS (DigitalOcean, Linode):**
Controle total, requer mais setup.

## ⚙️ Configuração no ChatGPT Desktop

Após deploy, configure no ChatGPT Desktop:

**macOS:** `~/Library/Application Support/OpenAI/ChatGPT/mcp_config.json`  
**Linux:** `~/.config/OpenAI/ChatGPT/mcp_config.json`  
**Windows:** `%APPDATA%\OpenAI\ChatGPT\mcp_config.json`

### Configuração Local (Desenvolvimento)

```json
{
  "mcpServers": {
    "biblia-diaria": {
      "command": "node",
      "args": [
        "/caminho/completo/para/server/dist/index-fastmcp.js"
      ],
      "env": {}
    }
  }
}
```

### Configuração FastMCP Cloud (Produção)

```json
{
  "mcpServers": {
    "biblia-diaria": {
      "url": "https://fastmcp.io/servers/biblia-diaria",
      "apiKey": "sua-api-key-aqui"
    }
  }
}
```

## 🧪 Testar Localmente

### Teste 1: Verificar servidor inicia

```bash
node server/dist/index-fastmcp.js
# Saída esperada: ✅ Bible Daily MCP Server running on stdio (FastMCP style)
```

### Teste 2: Testar com MCP Inspector

```bash
# Instalar MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Rodar inspector
mcp-inspector server/dist/index-fastmcp.js
```

### Teste 3: Testar cada tool

No MCP Inspector:

1. **Testar `obter_versiculo_diario`:**
```json
{
  "name": "obter_versiculo_diario",
  "arguments": {}
}
```

2. **Testar `listar_livros_disponiveis`:**
```json
{
  "name": "listar_livros_disponiveis",
  "arguments": {}
}
```

3. **Testar `obter_versiculo_por_livro`:**
```json
{
  "name": "obter_versiculo_por_livro",
  "arguments": {
    "livro": "João"
  }
}
```

## 📊 Validação FastMCP

Use o validador do projeto:

```bash
cd builder
npm install
npx ts-node src/validate.ts
```

Validações esperadas:
- ✅ 3 tools (quantidade ideal)
- ✅ 1 tool = 1 intention
- ✅ Schemas claros com Zod
- ✅ Respostas enxutas
- ✅ Sem "do_everything" tools

## 🚀 Scripts Úteis

Adicione ao `package.json`:

```json
{
  "scripts": {
    "build:fastmcp": "tsc && echo '✅ FastMCP server built'",
    "start:fastmcp": "node server/dist/index-fastmcp.js",
    "dev:fastmcp": "npm run build:fastmcp && npm run start:fastmcp",
    "validate:fastmcp": "cd builder && npx ts-node src/validate.ts",
    "deploy:fastmcp": "npm run build:fastmcp && fastmcp deploy"
  }
}
```

## 🔍 Troubleshooting

### Servidor não inicia

```bash
# Verificar se foi compilado
ls server/dist/index-fastmcp.js

# Re-build
npm run build:fastmcp
```

### Tools não aparecem no ChatGPT

```bash
# 1. Verificar config JSON está correto
cat ~/.config/OpenAI/ChatGPT/mcp_config.json

# 2. Verificar caminho absoluto
which node
realpath server/dist/index-fastmcp.js

# 3. Reiniciar ChatGPT Desktop
```

### Erro "Cannot find module"

```bash
# Instalar dependências de produção
npm ci --only=production

# Verificar imports
grep -r "import.*from" server/dist/
```

## 📈 Monitoramento FastMCP

Se usando FastMCP Cloud:

```bash
# Ver logs em tempo real
fastmcp logs biblia-diaria --follow

# Ver métricas
fastmcp metrics biblia-diaria

# Ver health status
fastmcp health biblia-diaria
```

## ✅ Checklist de Deploy

- [ ] Build executado sem erros
- [ ] Todas as tools testadas localmente
- [ ] Validação FastMCP passou
- [ ] Configuração mcp_config.json criada
- [ ] Servidor testado no ChatGPT Desktop
- [ ] Deploy realizado (local ou cloud)
- [ ] Monitoramento configurado
- [ ] Documentação atualizada

## 🎯 Princípios FastMCP (Resumo)

1. **Clareza > Complexidade**
   - Nomes claros para tools
   - Schemas explícitos
   - Uma intenção por tool

2. **Previsibilidade**
   - Respostas consistentes
   - Errors informativos
   - Sem side-effects escondidos

3. **Simplicidade**
   - Sem over-engineering
   - Código direto
   - Mínimo de abstrações

4. **UX Nativa**
   - ChatGPT entende facilmente
   - Modelo age com autonomia
   - Menos erros de interpretação

## 🔗 Links Úteis

- [Model Context Protocol Docs](https://modelcontextprotocol.io/)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/sdk)
- [FastMCP Style Guide](https://github.com/modelcontextprotocol/mcp)
- [Apps SDK OpenAI](https://platform.openai.com/docs/apps)

---

**Pronto para produção!** 🚀  
Servidor otimizado seguindo guidelines FastMCP
