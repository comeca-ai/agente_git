# � Deploy com Docker (Legacy/Opcional)

> **⚠️ AVISO:** Esta é uma opção avançada e opcional. Para uso normal no ChatGPT Desktop, use o **[FASTMCP_DEPLOY.md](FASTMCP_DEPLOY.md)** que é muito mais simples!

> **Recomendado:** [FASTMCP_QUICKSTART.md](FASTMCP_QUICKSTART.md) - Deploy em 3 passos

---

Este guia contém instruções para deploy com Docker, útil apenas para:
- Deploy em cloud/produção com alta escala
- Ambientes que exigem containers
- Deployment em Kubernetes
- Casos de uso específicos de infraestrutura

**Para 99% dos casos, use FastMCP direto!**

---

## 📋 Pré-requisitos

- **Docker** 20.10+ instalado ([Instalar Docker](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0+ ([Instalar Docker Compose](https://docs.docker.com/compose/install/))
- **Git** para clonar o repositório
- Pelo menos **2GB** de espaço em disco
- **2GB** de RAM disponível

## 🎯 Opções de Deploy

### 1. Deploy Rápido com Docker Compose (Recomendado)

A forma mais simples de fazer deploy:

```bash
# 1. Clone o repositório (se ainda não fez)
git clone <seu-repositorio>
cd agente_git

# 2. Execute o script de deploy
./deploy.sh production
```

O script irá:
- ✅ Construir a imagem Docker
- ✅ Instalar dependências
- ✅ Fazer build do servidor e do widget
- ✅ Iniciar o container
- ✅ Verificar a saúde da aplicação

### 2. Deploy Manual com Docker Compose

Se preferir ter mais controle:

```bash
# 1. Build da imagem
docker-compose build

# 2. Iniciar os serviços
docker-compose up -d

# 3. Verificar logs
docker-compose logs -f
```

### 3. Deploy Manual com Docker (Sem Compose)

Para ambientes que não têm docker-compose:

```bash
# 1. Build da imagem
docker build -t biblia-diaria-mcp:production .

# 2. Executar o container
docker run -d \
  --name biblia-diaria-mcp \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  biblia-diaria-mcp:production

# 3. Verificar logs
docker logs -f biblia-diaria-mcp
```

## 🔧 Configurações de Ambiente

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Ambiente de execução
NODE_ENV=production

# Porta do servidor (se usando HTTP)
PORT=3000

# Outras configurações opcionais
LOG_LEVEL=info
```

### Configuração do MCP no ChatGPT Desktop

Para usar o servidor MCP com o ChatGPT Desktop:

1. **Localize o arquivo de configuração:**
   - macOS: `~/Library/Application Support/OpenAI/ChatGPT/mcp_config.json`
   - Windows: `%APPDATA%\OpenAI\ChatGPT\mcp_config.json`
   - Linux: `~/.config/OpenAI/ChatGPT/mcp_config.json`

2. **Adicione a configuração do servidor:**

```json
{
  "mcpServers": {
    "biblia-diaria": {
      "command": "node",
      "args": [
        "/caminho/completo/para/server/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

3. **Reinicie o ChatGPT Desktop**

## 🌐 Deploy em Nuvem

### Deploy no AWS EC2

```bash
# 1. Conecte-se à instância EC2
ssh -i sua-chave.pem ubuntu@seu-ip

# 2. Instale Docker
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker $USER

# 3. Clone e faça deploy
git clone <seu-repositorio>
cd agente_git
./deploy.sh production
```

### Deploy no Google Cloud Platform (GCP)

```bash
# 1. Crie uma instância VM
gcloud compute instances create biblia-diaria \
  --machine-type=e2-medium \
  --zone=us-central1-a

# 2. SSH na instância
gcloud compute ssh biblia-diaria

# 3. Instale Docker e faça deploy
sudo apt-get update && sudo apt-get install -y docker.io docker-compose
git clone <seu-repositorio>
cd agente_git
sudo ./deploy.sh production
```

### Deploy no DigitalOcean

1. Crie um Droplet com Docker pré-instalado
2. SSH na máquina
3. Clone o repositório e execute `./deploy.sh`

### Deploy no Railway/Render

1. Conecte seu repositório Git
2. Configure o build command: `npm run build`
3. Configure o start command: `node server/dist/index.js`
4. Deploy automático!

## 📊 Monitoramento

### Verificar Status do Container

```bash
# Status dos containers
docker-compose ps

# Logs em tempo real
docker-compose logs -f

# Logs de um serviço específico
docker logs -f biblia-diaria-mcp
```

### Health Check

O container inclui um health check que verifica a cada 30 segundos se a aplicação está respondendo:

```bash
# Verificar health status
docker inspect --format='{{.State.Health.Status}}' biblia-diaria-mcp
```

### Métricas de Recursos

```bash
# Ver uso de CPU/Memória
docker stats biblia-diaria-mcp

# Ver logs de espaço
docker system df
```

## 🔄 Atualizações

### Atualizar para Nova Versão

```bash
# 1. Baixar últimas alterações
git pull origin main

# 2. Re-deploy
./deploy.sh production
```

### Rollback para Versão Anterior

```bash
# 1. Parar container atual
docker-compose down

# 2. Voltar para commit anterior
git checkout <commit-anterior>

# 3. Re-deploy
./deploy.sh production
```

## 🛠️ Troubleshooting

### Container não inicia

```bash
# Verificar logs
docker logs biblia-diaria-mcp

# Verificar se porta está disponível
lsof -i :3000

# Remover containers antigos
docker-compose down
docker system prune -a
```

### Build falha

```bash
# Limpar cache do Docker
docker builder prune -a

# Build sem cache
docker-compose build --no-cache
```

### Problemas de Memória

```bash
# Aumentar limite de memória do container
docker run -d \
  --memory="2g" \
  --memory-swap="2g" \
  biblia-diaria-mcp:production
```

### Verificar Conectividade

```bash
# Testar se o servidor está respondendo
curl http://localhost:3000/health

# Entrar no container
docker exec -it biblia-diaria-mcp sh
```

## 🔒 Segurança

### Melhores Práticas

1. **Não exponha portas desnecessárias**
2. **Use variáveis de ambiente para segredos**
3. **Mantenha o Docker atualizado**
4. **Use imagens oficiais**
5. **Limite recursos do container**

### Configurar HTTPS (Nginx + Let's Encrypt)

```bash
# Instalar Nginx
sudo apt-get install nginx certbot python3-certbot-nginx

# Configurar proxy reverso
sudo nano /etc/nginx/sites-available/biblia-diaria

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com
```

## 📦 Backup

### Backup dos Dados

```bash
# Backup de volumes (se houver)
docker run --rm \
  -v biblia-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz /data
```

### Backup da Configuração

```bash
# Backup do docker-compose e configs
tar czf config-backup.tar.gz \
  docker-compose.yml \
  .env \
  mcp-config*.json
```

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique os logs: `docker logs -f biblia-diaria-mcp`
2. Consulte a documentação do MCP
3. Abra uma issue no repositório

## 🎯 Comandos Úteis

```bash
# Ver status
docker-compose ps

# Parar aplicação
docker-compose stop

# Iniciar aplicação
docker-compose start

# Reiniciar aplicação
docker-compose restart

# Remover tudo
docker-compose down -v

# Ver logs
docker-compose logs -f --tail=100

# Entrar no container
docker exec -it biblia-diaria-mcp sh

# Rebuild e restart
docker-compose up -d --build
```

## 🚀 Deploy em Diferentes Ambientes

### Desenvolvimento

```bash
./deploy.sh development
```

### Staging

```bash
./deploy.sh staging
```

### Produção

```bash
./deploy.sh production
```

---

**Nota:** Este é um servidor MCP (Model Context Protocol) projetado para integração com ChatGPT Desktop. Para uso standalone ou via HTTP, certifique-se de ter o servidor HTTP configurado em `server/src/index-http.ts`.
