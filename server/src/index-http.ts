/**
 * MCP Server - Bible Daily App (HTTP Server with Auth)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
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
import http from "http";

// API Key (pode ser configurada via env)
const API_KEY = process.env.MCP_API_KEY || "biblia-diaria-key-2024";

// Zod schemas for tool inputs
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
      tools: {},
    },
  }
);

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
        annotations: {
          readOnlyHint: true,
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
        annotations: {
          readOnlyHint: true,
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
        annotations: {
          readOnlyHint: true,
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
        
        return {
          content: [
            {
              type: "text",
              text: formattedVerse,
            },
          ],
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

// Middleware de autenticação
function checkAuth(req: http.IncomingMessage): boolean {
  const authHeader = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'];
  
  // Aceitar Authorization: Bearer <key> ou X-API-Key: <key>
  if (authHeader && authHeader === `Bearer ${API_KEY}`) {
    return true;
  }
  
  if (apiKey && apiKey === API_KEY) {
    return true;
  }
  
  return false;
}

// Create HTTP server with SSE transport
const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(async (req, res) => {
  // CORS headers para permitir requisições do ChatGPT
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check público (sem auth)
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ 
      status: "ok", 
      server: "biblia-diaria-mcp",
      auth: "required"
    }));
    return;
  }

  // Endpoints protegidos - requerem autenticação
  if (req.url === "/sse" || req.url === "/messages") {
    if (!checkAuth(req)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ 
        error: "Unauthorized",
        message: "Valid API key required. Use Authorization: Bearer <key> or X-API-Key: <key>"
      }));
      return;
    }
  }

  if (req.url === "/sse") {
    const transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
    return;
  }

  if (req.url === "/messages" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const message = JSON.parse(body);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ received: true }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

httpServer.listen(PORT, () => {
  console.error(`Bible Daily MCP Server (HTTP with Auth) running on port ${PORT}`);
  console.error(`Health check: http://localhost:${PORT}/health`);
  console.error(`SSE endpoint: http://localhost:${PORT}/sse`);
  console.error(`API Key: ${API_KEY}`);
  console.error(`Use header: Authorization: Bearer ${API_KEY}`);
  console.error(`Or header: X-API-Key: ${API_KEY}`);
});
