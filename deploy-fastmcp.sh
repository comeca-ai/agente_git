#!/bin/bash

# Deploy Script for FastMCP - Bible Daily App
# Usage: ./deploy-fastmcp.sh [local|package|config]

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  FastMCP Deploy - Bible Daily${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

DEPLOY_TYPE=${1:-local}

case $DEPLOY_TYPE in
  local)
    echo -e "${GREEN}➜${NC} Deploy Local (ChatGPT Desktop)"
    echo ""
    
    # Build
    echo -e "${YELLOW}1. Building FastMCP server...${NC}"
    npm run build:server
    
    # Verificar build
    if [ ! -f "server/dist/index-fastmcp.js" ]; then
      echo -e "${RED}✖ Error: Build failed${NC}"
      exit 1
    fi
    echo -e "${GREEN}✓ Build successful${NC}"
    echo ""
    
    # Obter caminho absoluto
    ABSOLUTE_PATH=$(realpath server/dist/index-fastmcp.js)
    NODE_PATH=$(which node)
    
    # Determinar SO e caminho do config
    if [[ "$OSTYPE" == "darwin"* ]]; then
      CONFIG_PATH="$HOME/Library/Application Support/OpenAI/ChatGPT/mcp_config.json"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
      CONFIG_PATH="$HOME/.config/OpenAI/ChatGPT/mcp_config.json"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
      CONFIG_PATH="$APPDATA/OpenAI/ChatGPT/mcp_config.json"
    else
      CONFIG_PATH="~/.config/OpenAI/ChatGPT/mcp_config.json"
    fi
    
    # Criar diretório se não existir
    mkdir -p "$(dirname "$CONFIG_PATH")"
    
    # Gerar configuração
    echo -e "${YELLOW}2. Generating configuration...${NC}"
    cat > mcp_config_local.json << EOF
{
  "mcpServers": {
    "biblia-diaria": {
      "command": "$NODE_PATH",
      "args": [
        "$ABSOLUTE_PATH"
      ],
      "env": {}
    }
  }
}
EOF
    
    echo -e "${GREEN}✓ Configuration generated: mcp_config_local.json${NC}"
    echo ""
    
    # Instruções
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Deploy Local Completed!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "📝 Next steps:"
    echo -e "1. Copy the configuration:"
    echo -e "   ${BLUE}cp mcp_config_local.json \"$CONFIG_PATH\"${NC}"
    echo ""
    echo -e "2. Or merge with existing config if you have other servers"
    echo ""
    echo -e "3. Restart ChatGPT Desktop"
    echo ""
    echo -e "4. Test the server:"
    echo -e "   Ask ChatGPT: \"me dê um versículo bíblico\""
    echo ""
    echo -e "📄 Config file: ${BLUE}mcp_config_local.json${NC}"
    echo -e "🔧 Server path: ${BLUE}$ABSOLUTE_PATH${NC}"
    ;;
    
  package)
    echo -e "${GREEN}➜${NC} Creating deployment package"
    echo ""
    
    # Build
    echo -e "${YELLOW}1. Building...${NC}"
    npm run build:server
    
    # Criar diretório de deploy
    echo -e "${YELLOW}2. Creating package...${NC}"
    rm -rf deploy-package
    mkdir -p deploy-package
    
    # Copiar arquivos necessários
    cp -r server/dist deploy-package/
    cp package.json deploy-package/
    cp package-lock.json deploy-package/
    
    # Instalar apenas dependências de produção
    echo -e "${YELLOW}3. Installing production dependencies...${NC}"
    cd deploy-package
    npm ci --only=production
    cd ..
    
    # Criar arquivo tar.gz
    echo -e "${YELLOW}4. Creating archive...${NC}"
    tar -czf biblia-diaria-fastmcp.tar.gz -C deploy-package .
    
    echo -e "${GREEN}✓ Package created: biblia-diaria-fastmcp.tar.gz${NC}"
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Package Created Successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "📦 Package: ${BLUE}biblia-diaria-fastmcp.tar.gz${NC}"
    echo -e "📁 Temp dir: ${BLUE}deploy-package/${NC}"
    echo ""
    echo -e "You can now:"
    echo -e "1. Upload to FastMCP Cloud"
    echo -e "2. Deploy to remote server"
    echo -e "3. Share with other developers"
    ;;
    
  config)
    echo -e "${GREEN}➜${NC} Showing configuration examples"
    echo ""
    
    ABSOLUTE_PATH=$(realpath server/dist/index-fastmcp.js 2>/dev/null || echo "/full/path/to/server/dist/index-fastmcp.js")
    
    echo -e "${YELLOW}Local Configuration (Development):${NC}"
    cat << EOF
{
  "mcpServers": {
    "biblia-diaria": {
      "command": "node",
      "args": [
        "$ABSOLUTE_PATH"
      ],
      "env": {}
    }
  }
}
EOF
    echo ""
    echo -e "${YELLOW}FastMCP Cloud Configuration (Production):${NC}"
    cat << EOF
{
  "mcpServers": {
    "biblia-diaria": {
      "url": "https://fastmcp.io/servers/biblia-diaria",
      "apiKey": "your-api-key-here"
    }
  }
}
EOF
    echo ""
    ;;
    
  *)
    echo "Usage: $0 [local|package|config]"
    echo ""
    echo "Options:"
    echo "  local   - Deploy locally for ChatGPT Desktop"
    echo "  package - Create deployment package"
    echo "  config  - Show configuration examples"
    exit 1
    ;;
esac
