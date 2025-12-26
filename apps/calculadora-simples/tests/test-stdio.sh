#!/bin/bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node server/dist/index.js
