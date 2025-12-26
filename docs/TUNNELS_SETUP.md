# 🌐 Servidor MCP com Túneis (ngrok/Cloudflare)

## ⚠️ Problema: DevContainer + ChatGPT Desktop

Quando o servidor MCP está rodando em um **devcontainer** ou **ambiente remoto**, o ChatGPT Desktop da sua máquina local **NÃO CONSEGUE** acessá-lo via stdio.

**Solução:** Expor o servidor via HTTP e usar um túnel seguro (ngrok ou Cloudflare Tunnel).

---

## 🏗️ Arquitetura da Solução

```
┌─────────────────┐
│  ChatGPT        │
│  Desktop        │  (Máquina Local)
│  (OpenAI)       │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Túnel Público  │
│  (ngrok ou      │
│   Cloudflare)   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  MCP Server     │
│  HTTP (SSE)     │  (DevContainer)
│  Port 3000      │
└─────────────────┘
```

---

## 📦 Implementação

### 1. Servidor HTTP com SSE

Criado em `server/src/index-http.ts`:

```typescript
// Usa SSEServerTransport em vez de StdioServerTransport
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

// HTTP Server com endpoints:
// - /health → Health check
// - /sse → SSE endpoint para MCP
// - /messages → POST endpoint para mensagens
```

### 2. Compilar e Rodar

```bash
# Compilar
npm run build:server

# Rodar servidor HTTP
node server/dist/index-http.js

# Servidor estará em http://localhost:3000
```

---

## 🚀 Opção 1: ngrok (Mais Simples)

### Instalação

```bash
# macOS
brew install ngrok

# Linux
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list && \
  sudo apt update && sudo apt install ngrok
```

### Configurar

```bash
# Criar conta gratuita em https://ngrok.com
# Obter authtoken
ngrok config add-authtoken SEU_TOKEN_AQUI
```

### Usar

```bash
# Terminal 1: Rodar servidor MCP
node server/dist/index-http.js

# Terminal 2: Criar túnel
ngrok http 3000
```

**Você receberá uma URL pública:**
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### Configurar no ChatGPT Desktop

Edite `~/.config/OpenAI/ChatGPT/mcp_config.json`:

```json
{
  "mcpServers": {
    "biblia-diaria": {
      "url": "https://abc123.ngrok.io/sse",
      "transport": "sse"
    }
  }
}
```

---

## 🔵 Opção 2: Cloudflare Tunnel (Mais Profissional)

### Instalação

```bash
# Linux/macOS
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Ou via brew (macOS)
brew install cloudflare/cloudflare/cloudflared
```

### Configurar

```bash
# 1. Login
cloudflared tunnel login

# 2. Criar túnel
cloudflared tunnel create mcp-biblia

# 3. Configurar
cat > ~/.cloudflared/config.yml << EOF
tunnel: mcp-biblia
credentials-file: ~/.cloudflared/SEU_UUID.json

ingress:
  - hostname: mcp-biblia.seu-dominio.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# 4. Criar DNS record
cloudflared tunnel route dns mcp-biblia mcp-biblia.seu-dominio.com
```

### Usar

```bash
# Terminal 1: Rodar servidor MCP
node server/dist/index-http.js

# Terminal 2: Rodar túnel
cloudflared tunnel run mcp-biblia
```

### Configurar no ChatGPT Desktop

```json
{
  "mcpServers": {
    "biblia-diaria": {
      "url": "https://mcp-biblia.seu-dominio.com/sse",
      "transport": "sse"
    }
  }
}
```

---

## 🔒 Segurança

### ⚠️ Considerações Importantes

1. **Autenticação:** Por padrão, o túnel é público. Implemente autenticação:
   ```typescript
   // Adicionar API key no servidor
   const API_KEY = process.env.MCP_API_KEY;
   
   if (req.headers['x-api-key'] !== API_KEY) {
     res.writeHead(401);
     res.end('Unauthorized');
     return;
   }
   ```

2. **Rate Limiting:** Proteja contra abuso
3. **HTTPS:** Sempre use (ngrok e Cloudflare já fornecem)
4. **Monitoramento:** Log de acessos

---

## 📝 Scripts Úteis

Adicione ao `package.json`:

```json
{
  "scripts": {
    "start:server:http": "node server/dist/index-http.js",
    "dev:server:http": "tsc && node server/dist/index-http.js",
    "tunnel:ngrok": "ngrok http 3000",
    "tunnel:cloudflare": "cloudflared tunnel run mcp-biblia"
  }
}
```

---

## 🧪 Testar Conexão

### 1. Health Check

```bash
curl http://localhost:3000/health
# Deve retornar: {"status":"ok","server":"biblia-diaria-mcp"}
```

### 2. Teste via Túnel

```bash
curl https://abc123.ngrok.io/health
```

### 3. Teste no ChatGPT Desktop

- Reinicie o ChatGPT Desktop
- O servidor "biblia-diaria" deve aparecer
- Teste: "Me dê um versículo para hoje"

---

## 🔧 Troubleshooting

### Erro: "Connection refused"

- Verifique se o servidor está rodando: `curl localhost:3000/health`
- Verifique se a porta está correta

### Erro: "Tunnel expired" (ngrok)

- URLs gratuitas do ngrok expiram
- Gere nova URL: `ngrok http 3000`
- Atualize `mcp_config.json` com nova URL

### Erro: "Authentication failed"

- Verifique as credenciais do túnel
- Cloudflare: verifique o arquivo de credentials
- ngrok: verifique o authtoken

### ChatGPT não vê o servidor

- Verifique se o JSON está válido
- Caminho correto: `~/.config/OpenAI/ChatGPT/mcp_config.json`
- Reinicie o ChatGPT **completamente**

---

## 📊 Comparação: ngrok vs Cloudflare

| Recurso | ngrok | Cloudflare Tunnel |
|---------|-------|-------------------|
| Setup | ⚡ Muito rápido | 📝 Requer configuração |
| Gratuito | ✅ Sim (com limitações) | ✅ Sim (sem limitações) |
| URL Fixa | 💰 Pago | ✅ Grátis |
| Domínio Customizado | 💰 Pago | ✅ Grátis |
| Produção | ⚠️ Não recomendado | ✅ Recomendado |
| DDoS Protection | ❌ Limitada | ✅ Incluída |

**Recomendação:**
- **Dev/Testes:** ngrok
- **Produção:** Cloudflare Tunnel

---

## ✅ Checklist de Produção

Antes de usar em produção:

- [ ] Implementar autenticação (API keys)
- [ ] Adicionar rate limiting
- [ ] Configurar logs estruturados
- [ ] Monitoramento de uptime
- [ ] Backups de configuração
- [ ] Documentar variáveis de ambiente
- [ ] Testar failover
- [ ] HTTPS obrigatório
- [ ] Validação de entrada rigorosa
- [ ] Health checks automatizados

---

## 📚 Referências

- [MCP SSE Transport Docs](https://modelcontextprotocol.io/docs/concepts/transports#sse)
- [ngrok Documentation](https://ngrok.com/docs)
- [Cloudflare Tunnel Guide](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [OpenAI Apps SDK Security](https://platform.openai.com/docs/guides/apps/security)

---

**✨ Agora seu servidor MCP está acessível pelo ChatGPT Desktop mesmo rodando em devcontainer!**
