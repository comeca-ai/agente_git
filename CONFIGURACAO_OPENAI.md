# 🚀 Como Configurar o Servidor MCP na OpenAI ChatGPT Desktop

Este guia mostra como integrar o servidor MCP da Bíblia Diária no ChatGPT Desktop da OpenAI.

## ✅ Pré-requisitos

1. ✅ ChatGPT Desktop app instalado (macOS, Windows ou Linux)
2. ✅ Node.js 18+ instalado
3. ✅ Projeto compilado (`npm run build` executado)

## 📝 Passo a Passo

### 1. Compile o Projeto

Primeiro, certifique-se de que o servidor está compilado:

```bash
cd /workspaces/agente_git
npm run build
```

Isso irá gerar o arquivo `server/dist/index.js` que será usado pelo ChatGPT.

### 2. Localize o Arquivo de Configuração MCP

O ChatGPT Desktop usa um arquivo de configuração JSON para registrar servidores MCP:

**macOS:**
```bash
~/Library/Application Support/OpenAI/ChatGPT/mcp_config.json
```

**Windows:**
```
%APPDATA%\OpenAI\ChatGPT\mcp_config.json
```

**Linux:**
```bash
~/.config/OpenAI/ChatGPT/mcp_config.json
```

### 3. Edite o Arquivo de Configuração

Abra o arquivo `mcp_config.json` (crie-o se não existir) e adicione:

```json
{
  "mcpServers": {
    "biblia-diaria": {
      "command": "node",
      "args": [
        "/CAMINHO_COMPLETO/agente_git/server/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

**⚠️ IMPORTANTE:** Substitua `/CAMINHO_COMPLETO/agente_git` pelo caminho absoluto do seu projeto!

#### Como descobrir o caminho completo:

```bash
# No terminal, dentro da pasta do projeto:
pwd
# Resultado exemplo: /home/usuario/projetos/agente_git
```

Use esse caminho na configuração:
```json
"/home/usuario/projetos/agente_git/server/dist/index.js"
```

### 4. Exemplo de Configuração Completa

Se você já tem outros servidores MCP, adicione este ao objeto `mcpServers`:

```json
{
  "mcpServers": {
    "outro-servidor": {
      "command": "python",
      "args": ["outro_servidor.py"]
    },
    "biblia-diaria": {
      "command": "node",
      "args": [
        "/home/usuario/projetos/agente_git/server/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

### 5. Reinicie o ChatGPT Desktop

Depois de salvar o arquivo de configuração:
1. Feche completamente o ChatGPT Desktop
2. Abra novamente

### 6. Verifique a Conexão

No ChatGPT, você deverá ver o servidor MCP "biblia-diaria" disponível.

Teste com algum destes comandos:
- "Me dê um versículo para hoje"
- "Quero um versículo de Salmos"
- "Quais livros da Bíblia você tem?"

## 🧪 Testando Antes de Configurar na OpenAI

Você pode testar o servidor MCP localmente com o MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node server/dist/index.js
```

Isso abrirá uma interface web onde você pode testar as ferramentas antes de integrar ao ChatGPT.

## 🔧 Troubleshooting

### Problema: Servidor não aparece no ChatGPT

**Solução:**
1. Verifique se o caminho está correto e absoluto
2. Certifique-se de que o arquivo `server/dist/index.js` existe
3. Verifique se o JSON está válido (sem vírgulas extras, etc.)
4. Reinicie o ChatGPT completamente

### Problema: Erro ao executar o servidor

**Solução:**
1. Teste manualmente: `node /CAMINHO/server/dist/index.js`
2. Verifique se o Node.js está no PATH
3. Recompile o projeto: `npm run build`

### Problema: Tools não funcionam

**Solução:**
1. Verifique os logs do ChatGPT Desktop
2. Teste com o MCP Inspector primeiro
3. Certifique-se de que a versão do Node.js é 18+

## 📦 Arquivo de Configuração Pronto

Um arquivo `mcp-config.json` de exemplo está disponível na raiz do projeto. Você pode copiá-lo e adaptar o caminho:

```bash
# Copie o template
cat mcp-config.json

# Adapte o caminho e copie para a pasta do ChatGPT
```

## ✅ Verificação de Sucesso

Quando tudo estiver configurado corretamente:

✅ O ChatGPT Desktop reconhece o servidor "biblia-diaria"  
✅ Você pode solicitar versículos e receber respostas  
✅ O widget de visualização aparece corretamente  
✅ As ferramentas MCP estão funcionais  

## 🎯 Próximos Passos

Depois de configurar:
1. Explore os 3 tools disponíveis
2. Teste o widget de visualização
3. Personalize os versículos adicionando mais livros em `server/src/bible-data.ts`

---

**Precisa de ajuda?** Consulte a [documentação oficial da OpenAI sobre MCP](https://platform.openai.com/docs/guides/apps).
