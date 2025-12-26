# 🚀 FastMCP Quick Start - Bible Daily App

Servidor MCP otimizado seguindo **guidelines FastMCP** para deploy simplificado.

## ⚡ Deploy Rápido (3 passos)

### 1. Build do Servidor
```bash
npm install
npm run build:server
```

### 2. Deploy Local (ChatGPT Desktop)
```bash
./deploy-fastmcp.sh local
```

Isso cria automaticamente o arquivo `mcp_config_local.json` com o caminho correto.

### 3. Configurar no ChatGPT
```bash
# Copiar configuração para ChatGPT Desktop
cp mcp_config_local.json ~/.config/OpenAI/ChatGPT/mcp_config.json

# Reiniciar ChatGPT Desktop
```

## 🎯 Características FastMCP

✅ **3 tools claras** (1 tool = 1 intention)  
✅ **Schemas explícitos** com Zod  
✅ **Zero configuração** de ambiente  
✅ **Deploy em segundos**  
✅ **Pronto para produção**

## 📦 Tools Disponíveis

### `obter_versiculo_diario`
Obtém um versículo aleatório para inspiração diária.
```
Sem parâmetros
```

### `obter_versiculo_por_livro`
Obtém versículo de um livro específico.
```json
{ "livro": "João" }
```

### `listar_livros_disponiveis`
Lista todos os livros da Bíblia disponíveis.
```
Sem parâmetros
```

## 🔧 Comandos Úteis

```bash
# Testar servidor localmente
npm run start:fastmcp

# Rebuild
npm run build:server

# Validar guidelines FastMCP
npm run validate

# Validar OpenAI compliance
npm run validate:openai

# Criar package para deploy
./deploy-fastmcp.sh package

# Ver exemplos de configuração
./deploy-fastmcp.sh config
```

## 📁 Estrutura (Simplificada)

```
biblia-diaria-mcp/
├── server/
│   ├── src/
│   │   ├── index-fastmcp.ts    # ✅ Servidor FastMCP
│   │   └── bible-data.ts        # Dados
│   └── dist/                    # Build
├── deploy-fastmcp.sh            # Script de deploy
└── package.json
```

## 🌐 Outras Opções de Deploy

### Deploy em Cloud (Avançado)

Para apps que precisam estar sempre online ou serem acessados remotamente, você pode hospedar em:

**Opções:**
- Railway / Render (com index-http.ts)
- AWS Lambda (serverless)
- Google Cloud Run
- DigitalOcean Droplets

**Nota:** Para uso pessoal no ChatGPT Desktop, deploy local é suficiente e mais simples!

## 📚 Documentação Completa

- [FASTMCP_DEPLOY.md](FASTMCP_DEPLOY.md) - Guia completo FastMCP
- [DEPLOY.md](DEPLOY.md) - Deploy Docker e Cloud
- [README.md](README.md) - Documentação completa

## ✨ Por que FastMCP?

- **Simples:** Sem configurações complexas
- **Rápido:** Deploy em < 5 minutos
- **Leve:** Apenas dependências essenciais
- **Padrão:** Segue guidelines oficiais
- **Confiável:** Pronto para produção

---

**Status:** ✅ Pronto para uso  
**Versão:** 1.0.0  
**Estilo:** FastMCP compliant
