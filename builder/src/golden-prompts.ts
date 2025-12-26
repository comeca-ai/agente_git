/**
 * Golden Prompts for Bible Daily App
 * Test cases to validate tool discovery and execution
 */

export const goldenPrompts = {
  // Direct requests
  direct: [
    {
      prompt: "Me dê um versículo para hoje",
      expectedTool: "obter_versiculo_diario",
      description: "User wants a daily verse",
    },
    {
      prompt: "Quero um versículo de Salmos",
      expectedTool: "obter_versiculo_por_livro",
      expectedArgs: { livro: "Salmos" },
      description: "User wants verse from specific book",
    },
    {
      prompt: "Quais livros da Bíblia você tem?",
      expectedTool: "listar_livros_disponiveis",
      description: "User wants to see available books",
    },
    {
      prompt: "Me mostre um versículo de João",
      expectedTool: "obter_versiculo_por_livro",
      expectedArgs: { livro: "João" },
      description: "User wants verse from John",
    },
  ],

  // Indirect requests
  indirect: [
    {
      prompt: "Preciso de inspiração espiritual",
      expectedTool: "obter_versiculo_diario",
      description: "User needs spiritual inspiration (should get random verse)",
    },
    {
      prompt: "Me ajude com uma palavra da Bíblia",
      expectedTool: "obter_versiculo_diario",
      description: "User wants biblical guidance",
    },
    {
      prompt: "O que você tem de Provérbios?",
      expectedTool: "obter_versiculo_por_livro",
      expectedArgs: { livro: "Provérbios" },
      description: "User asking about specific book",
    },
  ],

  // Negative cases (should handle gracefully)
  negative: [
    {
      prompt: "Quero um versículo de Gênesis",
      expectedTool: "obter_versiculo_por_livro",
      expectedArgs: { livro: "Gênesis" },
      expectedError: true,
      description: "User requests unavailable book (should return error)",
    },
    {
      prompt: "Me dê versículo 1:1 de João",
      expectedTool: "obter_versiculo_por_livro",
      expectedArgs: { livro: "João" },
      description: "User requests specific verse (should return random from book)",
    },
  ],

  // Edge cases
  edge: [
    {
      prompt: "Lista os livros",
      expectedTool: "listar_livros_disponiveis",
      description: "Short command for listing books",
    },
    {
      prompt: "Versículo aleatório",
      expectedTool: "obter_versiculo_diario",
      description: "Explicit request for random verse",
    },
  ],
};

// Test runner (for manual validation)
export function printGoldenPrompts() {
  console.log("=" .repeat(80));
  console.log("GOLDEN PROMPTS TEST SUITE");
  console.log("=" .repeat(80));
  console.log();

  console.log("📋 DIRECT REQUESTS");
  console.log("-" .repeat(80));
  goldenPrompts.direct.forEach((test, i) => {
    console.log(`${i + 1}. "${test.prompt}"`);
    console.log(`   Expected: ${test.expectedTool}`);
    if (test.expectedArgs) {
      console.log(`   Args: ${JSON.stringify(test.expectedArgs)}`);
    }
    console.log(`   ${test.description}`);
    console.log();
  });

  console.log("📋 INDIRECT REQUESTS");
  console.log("-" .repeat(80));
  goldenPrompts.indirect.forEach((test, i) => {
    console.log(`${i + 1}. "${test.prompt}"`);
    console.log(`   Expected: ${test.expectedTool}`);
    if (test.expectedArgs) {
      console.log(`   Args: ${JSON.stringify(test.expectedArgs)}`);
    }
    console.log(`   ${test.description}`);
    console.log();
  });

  console.log("📋 NEGATIVE CASES");
  console.log("-" .repeat(80));
  goldenPrompts.negative.forEach((test, i) => {
    console.log(`${i + 1}. "${test.prompt}"`);
    console.log(`   Expected: ${test.expectedTool}`);
    if (test.expectedError) {
      console.log(`   Should return error: YES`);
    }
    console.log(`   ${test.description}`);
    console.log();
  });

  console.log("📋 EDGE CASES");
  console.log("-" .repeat(80));
  goldenPrompts.edge.forEach((test, i) => {
    console.log(`${i + 1}. "${test.prompt}"`);
    console.log(`   Expected: ${test.expectedTool}`);
    console.log(`   ${test.description}`);
    console.log();
  });

  console.log("=" .repeat(80));
  console.log("TEST WITH MCP INSPECTOR");
  console.log("=" .repeat(80));
  console.log();
  console.log("1. Start the MCP server:");
  console.log("   npm run start:server");
  console.log();
  console.log("2. Connect with MCP Inspector:");
  console.log("   npx @modelcontextprotocol/inspector node server/dist/index.js");
  console.log();
  console.log("3. Test each prompt and verify:");
  console.log("   - Correct tool is called");
  console.log("   - Arguments are extracted properly");
  console.log("   - Response is well-formatted");
  console.log("   - Widget displays correctly");
  console.log();
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  printGoldenPrompts();
}
