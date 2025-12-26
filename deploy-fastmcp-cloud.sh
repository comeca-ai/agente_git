#!/bin/bash

# FastMCP Cloud Deploy Script
# Deploy MCP servers to FastMCP cloud platform

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Load API key
if [ -f ".env.fastmcp" ]; then
    source .env.fastmcp
else
    echo -e "${RED}❌ .env.fastmcp not found${NC}"
    echo "Create .env.fastmcp with your FASTMCP_API_KEY"
    exit 1
fi

if [ -z "$FASTMCP_API_KEY" ]; then
    echo -e "${RED}❌ FASTMCP_API_KEY not set${NC}"
    exit 1
fi

APP_DIR=${1:-.}
APP_NAME=$(basename "$APP_DIR")

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  FastMCP Cloud Deploy${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verificar se é um app MCP válido
if [ ! -f "$APP_DIR/package.json" ]; then
    echo -e "${RED}❌ package.json not found in $APP_DIR${NC}"
    exit 1
fi

if [ ! -d "$APP_DIR/server" ]; then
    echo -e "${RED}❌ server/ directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}➜${NC} Deploying $APP_NAME to FastMCP Cloud"
echo ""

# Build
echo -e "${YELLOW}1. Building server...${NC}"
cd "$APP_DIR"
npm run build

if [ ! -f "server/dist/index.js" ]; then
    echo -e "${RED}✖ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}"
echo ""

# Criar package para deploy
echo -e "${YELLOW}2. Creating deployment package...${NC}"
tar -czf deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='*.log' \
    server/dist/ \
    package.json \
    package-lock.json

echo -e "${GREEN}✓ Package created${NC}"
echo ""

# Upload para FastMCP
echo -e "${YELLOW}3. Uploading to FastMCP Cloud...${NC}"

UPLOAD_RESPONSE=$(curl -s -X POST \
    "${FASTMCP_API_URL:-https://api.fastmcp.com/v1}/servers" \
    -H "Authorization: Bearer $FASTMCP_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"$APP_NAME\",
        \"runtime\": \"nodejs18\",
        \"transport\": \"stdio\"
    }")

SERVER_ID=$(echo "$UPLOAD_RESPONSE" | jq -r '.server_id // empty')

if [ -z "$SERVER_ID" ]; then
    echo -e "${RED}✖ Failed to create server${NC}"
    echo "$UPLOAD_RESPONSE" | jq .
    exit 1
fi

echo -e "${GREEN}✓ Server created: $SERVER_ID${NC}"
echo ""

# Upload código
echo -e "${YELLOW}4. Uploading code...${NC}"

UPLOAD_URL=$(echo "$UPLOAD_RESPONSE" | jq -r '.upload_url')

if [ -n "$UPLOAD_URL" ]; then
    curl -s -X PUT \
        "$UPLOAD_URL" \
        -H "Content-Type: application/gzip" \
        --data-binary @deploy.tar.gz
    
    echo -e "${GREEN}✓ Code uploaded${NC}"
else
    # Fallback: upload via multipart
    curl -s -X POST \
        "${FASTMCP_API_URL}/servers/$SERVER_ID/upload" \
        -H "Authorization: Bearer $FASTMCP_API_KEY" \
        -F "file=@deploy.tar.gz"
    
    echo -e "${GREEN}✓ Code uploaded${NC}"
fi
echo ""

# Deploy
echo -e "${YELLOW}5. Deploying...${NC}"

DEPLOY_RESPONSE=$(curl -s -X POST \
    "${FASTMCP_API_URL}/servers/$SERVER_ID/deploy" \
    -H "Authorization: Bearer $FASTMCP_API_KEY")

DEPLOY_STATUS=$(echo "$DEPLOY_RESPONSE" | jq -r '.status // "unknown"')

if [ "$DEPLOY_STATUS" = "deployed" ] || [ "$DEPLOY_STATUS" = "pending" ]; then
    echo -e "${GREEN}✓ Deploy initiated${NC}"
else
    echo -e "${RED}✖ Deploy failed${NC}"
    echo "$DEPLOY_RESPONSE" | jq .
    exit 1
fi
echo ""

# Aguardar deploy completar
echo -e "${YELLOW}6. Waiting for deployment...${NC}"

for i in {1..30}; do
    sleep 2
    
    STATUS_RESPONSE=$(curl -s \
        "${FASTMCP_API_URL}/servers/$SERVER_ID" \
        -H "Authorization: Bearer $FASTMCP_API_KEY")
    
    STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" = "running" ]; then
        echo -e "${GREEN}✓ Server is running${NC}"
        break
    elif [ "$STATUS" = "failed" ]; then
        echo -e "${RED}✖ Deployment failed${NC}"
        exit 1
    fi
    
    echo -n "."
done
echo ""

# Cleanup
rm -f deploy.tar.gz

# Mostrar informações
SERVER_URL=$(echo "$STATUS_RESPONSE" | jq -r '.url')

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Successful!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Server ID:${NC} $SERVER_ID"
echo -e "${YELLOW}Server URL:${NC} $SERVER_URL"
echo ""
echo -e "${CYAN}📝 ChatGPT Desktop Config:${NC}"
echo ""
cat << EOF
{
  "mcpServers": {
    "$APP_NAME": {
      "url": "$SERVER_URL",
      "transport": "stdio",
      "headers": {
        "Authorization": "Bearer $FASTMCP_API_KEY"
      }
    }
  }
}
EOF
echo ""
echo -e "${CYAN}💡 Next steps:${NC}"
echo "1. Copy the config above to ~/.config/OpenAI/ChatGPT/mcp_config.json"
echo "2. Restart ChatGPT Desktop"
echo "3. Test your server!"
echo ""
echo -e "${YELLOW}Manage your server:${NC}"
echo "  View logs:   curl -H 'Authorization: Bearer \$FASTMCP_API_KEY' ${FASTMCP_API_URL}/servers/$SERVER_ID/logs"
echo "  Stop:        curl -X POST -H 'Authorization: Bearer \$FASTMCP_API_KEY' ${FASTMCP_API_URL}/servers/$SERVER_ID/stop"
echo "  Restart:     curl -X POST -H 'Authorization: Bearer \$FASTMCP_API_KEY' ${FASTMCP_API_URL}/servers/$SERVER_ID/restart"
echo ""

cd - > /dev/null
