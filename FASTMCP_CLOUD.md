# ☁️ FastMCP Cloud Deployment

Este guia mostra como fazer deploy de servidores MCP na **FastMCP Cloud Platform**.

## 🎯 O Que é FastMCP Cloud?

FastMCP Cloud é uma plataforma de hospedagem especializada para servidores MCP, oferecendo:

- ✅ **Deploy com 1 comando**
- ✅ **Escalabilidade automática**
- ✅ **Monitoramento integrado**
- ✅ **99.9% uptime SLA**
- ✅ **SSL/TLS automático**
- ✅ **Logs em tempo real**

---

## 🔑 Setup da API Key

### 1. Obter API Key

Sua API key já está configurada:
```
fmcp_jZTsmIENP59RhZyMlUD9YIgbjSNDKrNWxzVaP2UxoXo
```

### 2. Configurar Localmente

```bash
# Criar arquivo .env.fastmcp
cat > .env.fastmcp << 'EOF'
FASTMCP_API_KEY="fmcp_jZTsmIENP59RhZyMlUD9YIgbjSNDKrNWxzVaP2UxoXo"
FASTMCP_API_URL="https://api.fastmcp.com/v1"
EOF

# Adicionar ao .gitignore (IMPORTANTE!)
echo ".env.fastmcp" >> .gitignore
```

⚠️ **NUNCA commite sua API key no Git!**

---

## 🚀 Deploy Automático (Via Builder)

Quando você usa `./create-fastmcp-app.sh` e escolhe "Deploy automático", o builder detecta automaticamente se você tem `.env.fastmcp` e oferece deploy na cloud:

```bash
./create-fastmcp-app.sh

# ... responder perguntas ...

Fazer deploy automático? [s/n]: s

# Deploy local...
✓ Configuração gerada: mcp_config_local.json

Deploy também no FastMCP Cloud? [s/n]: s

☁️  Deploying to FastMCP Cloud...
1. Building server...
✓ Build successful

2. Creating deployment package...
✓ Package created

3. Uploading to FastMCP Cloud...
✓ Server created: srv_abc123xyz

4. Uploading code...
✓ Code uploaded

5. Deploying...
✓ Deploy initiated

6. Waiting for deployment...
✓ Server is running

========================================
  Deployment Successful!
========================================

Server ID: srv_abc123xyz
Server URL: https://srv_abc123xyz.fastmcp.com

📝 ChatGPT Desktop Config:
{
  "mcpServers": {
    "seu-app": {
      "url": "https://srv_abc123xyz.fastmcp.com",
      "transport": "stdio",
      "headers": {
        "Authorization": "Bearer fmcp_jZTs..."
      }
    }
  }
}
```

---

## 🔧 Deploy Manual

### Para Apps Existentes

```bash
# Entrar no diretório do app
cd apps/seu-app

# Deploy
../../deploy-fastmcp-cloud.sh .
```

### Para Apps Fora do Builder

```bash
# Clone o repositório
git clone https://github.com/comeca-ai/agente_git.git
cd agente_git

# Configure API key
cp .env.fastmcp.example .env.fastmcp
# Edite e adicione sua key

# Deploy
./deploy-fastmcp-cloud.sh /caminho/para/seu/app
```

---

## 📊 Gerenciar Servidores

### Ver Logs

```bash
SERVER_ID="srv_abc123xyz"
curl -H "Authorization: Bearer $FASTMCP_API_KEY" \
     https://api.fastmcp.com/v1/servers/$SERVER_ID/logs
```

### Listar Servidores

```bash
curl -H "Authorization: Bearer $FASTMCP_API_KEY" \
     https://api.fastmcp.com/v1/servers
```

### Parar Servidor

```bash
curl -X POST \
     -H "Authorization: Bearer $FASTMCP_API_KEY" \
     https://api.fastmcp.com/v1/servers/$SERVER_ID/stop
```

### Reiniciar Servidor

```bash
curl -X POST \
     -H "Authorization: Bearer $FASTMCP_API_KEY" \
     https://api.fastmcp.com/v1/servers/$SERVER_ID/restart
```

### Deletar Servidor

```bash
curl -X DELETE \
     -H "Authorization: Bearer $FASTMCP_API_KEY" \
     https://api.fastmcp.com/v1/servers/$SERVER_ID
```

---

## 🔐 Segurança

### Best Practices

1. **Nunca exponha sua API key**
   ```bash
   # Adicione ao .gitignore
   echo ".env.fastmcp" >> .gitignore
   ```

2. **Rotacione keys regularmente**
   ```bash
   # Gerar nova key via dashboard
   # Atualizar .env.fastmcp
   # Re-deploy apps
   ```

3. **Use variáveis de ambiente em CI/CD**
   ```yaml
   # GitHub Actions
   env:
     FASTMCP_API_KEY: ${{ secrets.FASTMCP_API_KEY }}
   ```

4. **Restrinja permissões**
   - Use keys específicas por app quando possível
   - Configure IP whitelisting no dashboard

---

## 🌐 Configurar no ChatGPT Desktop

### Opção 1: Servidor Cloud (Remoto)

```json
{
  "mcpServers": {
    "seu-app": {
      "url": "https://srv_abc123xyz.fastmcp.com",
      "transport": "stdio",
      "headers": {
        "Authorization": "Bearer fmcp_jZTsmIENP59RhZyMlUD9YIgbjSNDKrNWxzVaP2UxoXo"
      }
    }
  }
}
```

### Opção 2: Ambos (Local + Cloud)

```json
{
  "mcpServers": {
    "seu-app-local": {
      "command": "node",
      "args": ["/caminho/local/server/dist/index.js"]
    },
    "seu-app-cloud": {
      "url": "https://srv_abc123xyz.fastmcp.com",
      "headers": {
        "Authorization": "Bearer fmcp_jZTs..."
      }
    }
  }
}
```

**Benefícios:**
- Local: desenvolvimento e testes
- Cloud: produção e compartilhamento

---

## 💰 Planos e Limites

### Free Tier
- ✅ 3 servidores ativos
- ✅ 100k requests/mês
- ✅ 1GB storage
- ✅ Logs 7 dias
- ✅ Community support

### Pro ($29/mês)
- ✅ Servidores ilimitados
- ✅ 10M requests/mês
- ✅ 10GB storage
- ✅ Logs 30 dias
- ✅ Priority support
- ✅ Custom domains

### Enterprise (Custom)
- ✅ Tudo do Pro
- ✅ SLA 99.99%
- ✅ Dedicated resources
- ✅ Advanced monitoring
- ✅ White-label

---

## 🐛 Troubleshooting

### Erro: "Authentication failed"

**Causa:** API key inválida ou expirada

**Solução:**
```bash
# Verificar key
cat .env.fastmcp

# Testar key
curl -H "Authorization: Bearer $FASTMCP_API_KEY" \
     https://api.fastmcp.com/v1/auth/verify
```

### Erro: "Build failed"

**Causa:** Código não compila ou dependências faltando

**Solução:**
```bash
# Testar build localmente
cd seu-app
npm install
npm run build

# Verificar logs
npm run build --verbose
```

### Erro: "Deployment timeout"

**Causa:** Deploy demorou mais de 60 segundos

**Solução:**
```bash
# Verificar status manualmente
curl -H "Authorization: Bearer $FASTMCP_API_KEY" \
     https://api.fastmcp.com/v1/servers/$SERVER_ID
     
# Ver logs de deploy
curl -H "Authorization: Bearer $FASTMCP_API_KEY" \
     https://api.fastmcp.com/v1/servers/$SERVER_ID/deploy-logs
```

### Servidor não responde

**Causa:** Servidor crashou ou está reiniciando

**Solução:**
```bash
# Ver logs
curl -H "Authorization: Bearer $FASTMCP_API_KEY" \
     https://api.fastmcp.com/v1/servers/$SERVER_ID/logs

# Reiniciar
curl -X POST \
     -H "Authorization: Bearer $FASTMCP_API_KEY" \
     https://api.fastmcp.com/v1/servers/$SERVER_ID/restart
```

---

## 📈 Monitoramento

### Health Checks

FastMCP Cloud faz health checks automáticos a cada 30 segundos:

```bash
# Status do servidor
curl -H "Authorization: Bearer $FASTMCP_API_KEY" \
     https://api.fastmcp.com/v1/servers/$SERVER_ID/health
```

**Resposta:**
```json
{
  "status": "healthy",
  "uptime": 3600,
  "requests_last_hour": 1234,
  "avg_response_time_ms": 45,
  "memory_usage_mb": 128,
  "cpu_usage_percent": 15
}
```

### Métricas

```bash
# Últimas 24 horas
curl -H "Authorization: Bearer $FASTMCP_API_KEY" \
     "https://api.fastmcp.com/v1/servers/$SERVER_ID/metrics?period=24h"
```

### Alertas

Configure alertas via dashboard:
- Downtime > 1 minuto
- Response time > 1 segundo
- Error rate > 5%
- Memory usage > 80%

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Deploy to FastMCP Cloud

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to FastMCP
        env:
          FASTMCP_API_KEY: ${{ secrets.FASTMCP_API_KEY }}
        run: |
          curl -X POST https://api.fastmcp.com/v1/deploy \
            -H "Authorization: Bearer $FASTMCP_API_KEY" \
            -F "file=@./server/dist/index.js" \
            -F "name=meu-app"
```

---

## 📚 Recursos Adicionais

- [FastMCP Dashboard](https://dashboard.fastmcp.com)
- [API Documentation](https://docs.fastmcp.com/api)
- [Status Page](https://status.fastmcp.com)
- [Community Forum](https://community.fastmcp.com)
- [Support](mailto:support@fastmcp.com)

---

## 🆚 Cloud vs Local

| Aspecto | Local | FastMCP Cloud |
|---------|-------|---------------|
| **Setup** | Instant | 2-3 minutos |
| **Manutenção** | Manual | Automática |
| **Escalabilidade** | Limitada | Automática |
| **Uptime** | Depende do PC | 99.9% SLA |
| **Compartilhamento** | Impossível | Fácil |
| **Custo** | Grátis | $0-29/mês |
| **Ideal para** | Dev/Teste | Produção |

---

## 🎉 Próximos Passos

1. ✅ Configurar `.env.fastmcp`
2. ✅ Deploy seu primeiro app
3. ✅ Testar no ChatGPT Desktop
4. ⬜ Configurar domínio customizado (Pro)
5. ⬜ Habilitar monitoramento
6. ⬜ Configurar CI/CD

---

**Deploy na nuvem em minutos!** ☁️
