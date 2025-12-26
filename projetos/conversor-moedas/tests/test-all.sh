#!/bin/bash
echo "🧪 Testando MCP Server..."
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node server/dist/index.js | grep -q "result" && echo "✅ Server OK" || echo "❌ Server failed"
