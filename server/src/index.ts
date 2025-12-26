/**
 * MCP Server - Bible Daily App
 * Following Apps SDK + FastMCP guidelines
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import {
  getAllBooks,
  getRandomVerse,
  getVerseFromBook,
  formatVerse,
  type Verse,
} from "./bible-data.js";

// Zod schemas for tool inputs (FastMCP style)
const ObterVersiculoDiarioSchema = z.object({});

const ObterVersiculoPorLivroSchema = z.object({
  livro: z.string().describe("Nome do livro da Bíblia (ex: João, Salmos, Provérbios)"),
});

const ListarLivrosDisponiveisSchema = z.object({});

// Create MCP server
const server = new Server(
  {
    name: "biblia-diaria",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Register widget as a resource (HTML + Skybridge)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "widget://biblia-diaria/main",
        mimeType: "text/html+skybridge",
        name: "Widget Bíblia Diária",
        description: "Interface para visualizar versículos bíblicos",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "widget://biblia-diaria/main") {
    // In production, this would load the compiled widget from web/dist
    // For now, we'll return a placeholder
    const widgetHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bíblia Diária</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 16px;
      margin: 0;
    }
    .verse-container {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .verse-reference {
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
    }
    .verse-text {
      color: #555;
      line-height: 1.6;
    }
    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin: 4px;
    }
    button:hover {
      background: #0056b3;
    }
  </style>
</head>
<body>
  <h2>📖 Bíblia Diária</h2>
  <div id="verse-display"></div>
  
  <script>
    // Access window.openai API for ChatGPT integration
    const displayVerse = (verse) => {
      const container = document.getElementById('verse-display');
      if (verse) {
        container.innerHTML = \`
          <div class="verse-container">
            <div class="verse-reference">\${verse.book} \${verse.chapter}:\${verse.verse}</div>
            <div class="verse-text">\${verse.text}</div>
          </div>
        \`;
      }
    };
    
    // Listen for tool output from ChatGPT
    if (window.openai && window.openai.toolOutput) {
      const output = window.openai.toolOutput;
      if (output.verse) {
        displayVerse(output.verse);
      }
    }
    
    // Initialize widget state
    if (window.openai && window.openai.setWidgetState) {
      window.openai.setWidgetState({
        initialized: true,
        lastUpdate: new Date().toISOString()
      });
    }
  </script>
</body>
</html>
    `;
    
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: "text/html+skybridge",
          text: widgetHtml,
        },
      ],
    };
  }
  
  throw new Error("Resource not found");
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "obter_versiculo_diario",
        description:
          "Use this tool when the user wants a daily Bible verse, a random verse for inspiration, or asks for a verse without specifying a book. " +
          "Returns a random verse from any book in the Bible. " +
          "This is a read-only operation that provides spiritual inspiration. " +
          "Do not use this tool if the user wants a verse from a specific book (use obter_versiculo_por_livro instead).",
        inputSchema: {
          type: "object",
          properties: {},
        },
        // Annotations following Apps SDK guidelines
        annotations: {
          readOnlyHint: true,  // Read-only operation
        },
      },
      {
        name: "obter_versiculo_por_livro",
        description:
          "Use this tool when the user wants a Bible verse from a specific book (e.g., João, Salmos, Provérbios, Mateus, Filipenses, Romanos). " +
          "Returns a random verse from the specified book. " +
          "This is a read-only operation. " +
          "Do not use this tool if the user wants any random verse (use obter_versiculo_diario instead) or wants to see available books (use listar_livros_disponiveis instead).",
        inputSchema: {
          type: "object",
          properties: {
            livro: {
              type: "string",
              description: "Nome do livro da Bíblia (ex: João, Salmos, Provérbios)",
            },
          },
          required: ["livro"],
        },
        // Annotations following Apps SDK guidelines
        annotations: {
          readOnlyHint: true,  // Read-only operation
        },
      },
      {
        name: "listar_livros_disponiveis",
        description:
          "Use this tool when the user wants to know which Bible books are available in the app, or asks 'what books do you have?'. " +
          "Returns a list of all available Bible books. " +
          "This is a read-only operation. " +
          "Do not use this tool if the user wants a specific verse.",
        inputSchema: {
          type: "object",
          properties: {},
        },
        // Annotations following Apps SDK guidelines
        annotations: {
          readOnlyHint: true,  // Read-only operation
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "obter_versiculo_diario": {
        const verse = getRandomVerse();
        const formattedVerse = formatVerse(verse);
        
        // Following Apps SDK: separate structuredContent (for model) and _meta (for widget)
        return {
          content: [
            {
              type: "text",
              text: formattedVerse,
            },
          ],
          // structuredContent: minimal data for the model
          structuredContent: {
            verse: {
              reference: `${verse.book} ${verse.chapter}:${verse.verse}`,
              text: verse.text,
            },
          },
          // _meta: additional data for widget only (not shown to model)
          _meta: {
            "openai/outputTemplate": "widget://biblia-diaria/main",
            verse: verse,
          },
        };
      }

      case "obter_versiculo_por_livro": {
        const parsed = ObterVersiculoPorLivroSchema.parse(args);
        const verse = getVerseFromBook(parsed.livro);
        
        if (!verse) {
          return {
            content: [
              {
                type: "text",
                text: `Livro "${parsed.livro}" não encontrado. Use a ferramenta listar_livros_disponiveis para ver os livros disponíveis.`,
              },
            ],
            isError: true,
          };
        }
        
        const formattedVerse = formatVerse(verse);
        
        return {
          content: [
            {
              type: "text",
              text: formattedVerse,
            },
          ],
          structuredContent: {
            verse: {
              reference: `${verse.book} ${verse.chapter}:${verse.verse}`,
              text: verse.text,
            },
          },
          _meta: {
            "openai/outputTemplate": "widget://biblia-diaria/main",
            verse: verse,
          },
        };
      }

      case "listar_livros_disponiveis": {
        const books = getAllBooks();
        const booksList = books.join(", ");
        
        return {
          content: [
            {
              type: "text",
              text: `Livros disponíveis: ${booksList}`,
            },
          ],
          structuredContent: {
            books: books,
            count: books.length,
          },
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid arguments: ${JSON.stringify(error.issues)}`);
    }
    throw error;
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Bible Daily MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
