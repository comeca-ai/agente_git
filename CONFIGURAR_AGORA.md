# 🚀 Instruções Finais - Conectar ChatGPT Desktop

## ✅ Status Atual

✅ Servidor MCP HTTP compilado  
✅ Servidor rodando na porta 3000  
✅ Endpoints disponíveis:
- Health: `http://localhost:3000/health`
- SSE: `http://localhost:3000/sse`

---

## 📋 Opções de Configuração

Você tem **3 opções** para conectar o ChatGPT Desktop:

### 🔹 Opção 1: Usar ngrok (Recomendado para Teste Rápido)

**Passo 1:** Instalar ngrok
```bash
# Baixar e instalar
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list && \
  sudo apt update && sudo apt install ngrok

# Ou baixar diretamente
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/
```

**Passo 2:** Configurar conta
```bash
# Criar conta gratuita em: https://dashboard.ngrok.com/signup
# Copiar authtoken e executar:
ngrok config add-authtoken SEU_TOKEN_AQUI
```

**Passo 3:** Criar túnel
```bash
# Em um novo terminal
ngrok http 3000
```

**Você verá algo como:**
```
Forwarding   https://abc123def.ngrok.io -> http://localhost:3000
```

**Passo 4:** Configurar ChatGPT Desktop

Criar/editar: `~/.config/OpenAI/ChatGPT/mcp_config.json`

```json
{
  "mcpServers": {
    "biblia-diaria": {
      "url": "https://abc123def.ngrok.io/sse",
      "transport": "sse"
    }
  }
}
```

⚠️ **Importante:** Substitua `abc123def.ngrok.io` pela URL que o ngrok mostrou!

---

### 🔹 Opção 2: Usar Cloudflare Tunnel (Produção)

**Passo 1:** Instalar cloudflared
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

**Passo 2:** Configurar
```bash
# Login
cloudflared tunnel login

# Criar túnel
cloudflared tunnel create mcp-biblia

# Anotar o UUID que apareceu
# Criar config
cat > ~/.cloudflared/config.yml << EOF
tunnel: mcp-biblia
credentials-file: ~/.cloudflared/UUID_DO_SEU_TUNNEL.json

ingress:
  - hostname: mcp-biblia.seu-dominio.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# Criar DNS
cloudflared tunnel route dns mcp-biblia mcp-biblia.seu-dominio.com
```

**Passo 3:** Rodar túnel
```bash
cloudflared tunnel run mcp-biblia
```

**Passo 4:** Configurar ChatGPT Desktop
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

### 🔹 Opção 3: Usar GitHub Codespaces Port Forwarding

Se estiver usando GitHub Codespaces:

**Passo 1:** Expor porta 3000
- Vá na aba "Ports" no VS Code
- Adicione porta 3000
- Mude visibilidade para "Public"
- Copie a URL (ex: `https://abc-3000.app.github.dev`)

**Passo 2:** Configurar ChatGPT Desktop
```json
{
  "mcpServers": {
    "biblia-diaria": {
      "url": "https://abc-3000.app.github.dev/sse",
      "transport": "sse"
    }
  }
}
```

---

## 🧪 Testar Antes de Configurar

### 1. Verificar servidor local
```bash
curl http://localhost:3000/health
# Deve retornar: {"status":"ok","server":"biblia-diaria-mcp"}
```

### 2. Verificar pelo túnel
```bash
# Substitua pela sua URL do ngrok/Cloudflare
curl https://SUA_URL_AQUI/health
```

---

## 🎯 Passos Finais no ChatGPT Desktop

1. **Criar/editar arquivo de configuração:**
   ```bash
   # Linux
   nano ~/.config/OpenAI/ChatGPT/mcp_config.json
   
   # macOS
   nano ~/Library/Application\ Support/OpenAI/ChatGPT/mcp_config.json
   ```

2. **Cole a configuração** (com a URL do seu túnel)

3. **Salve** (Ctrl+O, Enter, Ctrl+X)

4. **Reinicie o ChatGPT Desktop completamente**

5. **Teste no ChatGPT:**
   - "Me dê um versículo para hoje"
   - "Quero um versículo de Salmos"
   - "Quais livros da Bíblia você tem?"

---

## ✅ Checklist Final

- [ ] Servidor HTTP rodando (`node server/dist/index-http.js`)
- [ ] Health check funcionando (`curl localhost:3000/health`)
- [ ] Túnel criado (ngrok/Cloudflare/Codespaces)
- [ ] URL pública acessível
- [ ] `mcp_config.json` criado com URL correta
- [ ] ChatGPT Desktop reiniciado
- [ ] Servidor "biblia-diaria" aparece no ChatGPT
- [ ] Ferramentas funcionando

---

## 🔧 Comandos Rápidos

### Iniciar tudo
```bash
# Terminal 1: Servidor MCP
cd /workspaces/agente_git && node server/dist/index-http.js

# Terminal 2: Túnel (escolha um)
ngrok http 3000
# OU
cloudflared tunnel run mcp-biblia
```

### Parar tudo
```bash
# Parar servidor
pkill -f "node server/dist/index-http.js"

# Parar túnel
pkill ngrok
# OU
pkill cloudflared
```

---

## 🆘 Problemas Comuns

**Servidor não inicia:**
```bash
# Recompilar
cd /workspaces/agente_git
npx tsc server/src/index-http.ts --outDir server/dist --esModuleInterop --module nodenext --moduleResolution nodenext

# Verificar porta disponível
lsof -i :3000
```

**Túnel não funciona:**
- Ngrok: Verifique se o authtoken está configurado
- Cloudflare: Verifique as credenciais e DNS
- Codespaces: Certifique-se que a porta é "Public"

**ChatGPT não vê servidor:**
- Verifique JSON válido no `mcp_config.json`
- Caminho correto do arquivo
- Reinicie ChatGPT **completamente** (feche e abra)

---

**🎉 Pronto! Seu servidor MCP está pronto para funcionar com o ChatGPT Desktop!**

Documentação completa: [docs/TUNNELS_SETUP.md](docs/TUNNELS_SETUP.md)
