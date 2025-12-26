# {{APP_NAME}}

{{APP_DESCRIPTION}}

## 🎯 What This App Does

**Problem:** {{APP_PROBLEM}}  
**User:** {{APP_USER}}

## ✅ OpenAI Apps SDK Compliance

This app follows all OpenAI Apps SDK guidelines:
- ✅ **Clear Tool Design:** 1 tool = 1 intention
- ✅ **Explicit Schemas:** Zod validation for all inputs
- ✅ **Error Handling:** Try-catch blocks and isError flags
- ✅ **Security:** Input validation, no hardcoded secrets
- ✅ **Privacy:** No PII collection, minimal data exposure
- ✅ **Documentation:** Clear usage instructions

## 🔧 Tools Available

{{TOOLS_DOCUMENTATION}}

## 🚀 Quick Start

### Installation

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Build the server
npm run build

# 3. Run the server
npm start
\`\`\`

### Configuration

**Local (ChatGPT Desktop):**

\`\`\`json
{
  "mcpServers": {
    "{{APP_NAME}}": {
      "command": "node",
      "args": ["/absolute/path/to/server/dist/index.js"],
      "env": {}
    }
  }
}
\`\`\`

**Config Location:**
- macOS: `~/Library/Application Support/OpenAI/ChatGPT/mcp_config.json`
- Linux: `~/.config/OpenAI/ChatGPT/mcp_config.json`
- Windows: `%APPDATA%\\OpenAI\\ChatGPT\\mcp_config.json`

## 📝 Usage Examples

{{USAGE_EXAMPLES}}

## 🔒 Security & Privacy

### Data Handling
- ✅ **No Personal Data:** This app does not collect or store any personal information
- ✅ **Read-Only:** All operations are read-only (where applicable)
- ✅ **Input Validation:** All inputs are validated using Zod schemas
- ✅ **Error Handling:** Errors are caught and returned safely

### Security Measures
- Server-side validation for all inputs
- No API keys or secrets in responses
- Proper error messages without sensitive data
- Defense against malformed inputs

## 🏗️ Architecture

\`\`\`
{{APP_NAME}}/
├── server/
│   ├── src/
│   │   └── index.ts          # MCP server (OpenAI compliant)
│   └── dist/                 # Compiled output
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

## 🛠️ Development

### Build
\`\`\`bash
npm run build
\`\`\`

### Run Locally
\`\`\`bash
npm start
\`\`\`

### Validate Compliance
\`\`\`bash
# From project root
npx ts-node builder/src/openai-compliance.ts apps/{{APP_NAME}}
\`\`\`

## 📊 Technical Details

- **Protocol:** MCP (Model Context Protocol)
- **Transport:** stdio (for ChatGPT Desktop)
- **Language:** TypeScript
- **Validation:** Zod schemas
- **Runtime:** Node.js 18+

## ✅ Pre-Submission Checklist

- [x] All tools working correctly
- [x] Input validation with Zod
- [x] Error handling implemented
- [x] Security audit passed
- [x] No PII collection
- [x] Documentation complete
- [x] FastMCP compliance
- [x] OpenAI guidelines followed

## 📚 References

- [OpenAI Apps SDK](https://platform.openai.com/docs/guides/apps)
- [Apps Submission Guidelines](https://developers.openai.com/apps-sdk/app-submission-guidelines)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [FastMCP Guidelines](https://github.com/modelcontextprotocol/mcp)

## 📞 Support

For issues or questions, please refer to the main project documentation.

## 📄 License

ISC

---

**Built with FastMCP Builder**  
Follows OpenAI Apps SDK guidelines ✅
