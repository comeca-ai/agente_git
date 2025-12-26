# 📁 Projetos MCP

Esta pasta contém todos os apps MCP criados pelos builders.

## 📦 Estrutura

Cada app é um projeto independente com:
- **server/** - Servidor MCP com TypeScript
- **tests/** - Testes automatizados
- **README.md** - Documentação completa
- **.git/** - Repositório Git próprio

## 🚀 Apps Criados

Os apps aparecem aqui após executar qualquer builder:
- `./create-app-natural.sh` - Modo natural (descreva livremente)
- `./create-app-interactive.sh` - Modo interativo simplificado
- `./create-fastmcp-app.sh` - Modo completo com todas opções
- `./create-app-from-config.sh` - A partir de JSON

## 📖 Exemplo

```
projetos/
├── conversor-moedas/
│   ├── server/
│   │   ├── src/index.ts
│   │   └── dist/index.js
│   ├── tests/
│   ├── package.json
│   └── README.md
├── calculadora-simples/
└── gerador-senhas/
```

## 🔧 Uso Típico

```bash
# Criar novo app
./create-app-natural.sh

# Entrar no app criado
cd projetos/meu-app

# Testar
npm test

# Deploy
cd ../..
./deploy-fastmcp-cloud.sh projetos/meu-app
```

## ✅ Cada App Inclui

- 21/21 OpenAI Guidelines implementadas
- TypeScript compilado
- Git inicializado com commit
- Testes automatizados
- README com documentação completa
- Pronto para deploy no FastMCP Cloud

## 📚 Mais Informações

- [Como usar o Builder Natural](../COMO_USAR_BUILDER_NATURAL.md)
- [Guia Completo](../COMPLETE_GUIDE.md)
- [Deploy FastMCP Cloud](../FASTMCP_CLOUD.md)
