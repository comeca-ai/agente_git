"""
Claude MCP Hooks - FastMCP Builder
Hooks para automatizar criação de apps MCP seguindo OpenAI Guidelines
"""

import os
import json
import subprocess
from typing import Dict, List, Optional, Any
from dataclasses import dataclass

@dataclass
class MCPApp:
    """Representa um app MCP a ser criado"""
    name: str
    problem: str
    user: str
    description: str
    has_ui: bool = False
    ui_type: Optional[str] = None
    ui_components: Optional[str] = None
    use_ui_agent: bool = False
    tools: List[Dict[str, str]] = None
    use_agents: bool = False
    agents: List[Dict[str, str]] = None

    def __post_init__(self):
        if self.tools is None:
            self.tools = []
        if self.agents is None:
            self.agents = []


class FastMCPBuilderHook:
    """
    Hook principal para Claude Desktop
    Segue framework OpenAI Apps SDK:
    1. Define Use Case
    2. Identify Capabilities (Tools)
    3. Orchestration (Agents)
    """
    
    def __init__(self):
        self.project_root = os.getcwd()
        self.templates_dir = os.path.join(self.project_root, "templates")
        self.apps_dir = os.path.join(self.project_root, "apps")
    
    # ============================================
    # PASSO 1: Define Use Case (OpenAI Framework)
    # ============================================
    
    def gather_use_case(self) -> Dict[str, Any]:
        """
        Coleta informações do caso de uso seguindo OpenAI Guidelines
        https://developers.openai.com/apps-sdk/plan/use-case
        """
        print("📝 PASSO 1: Defina a ideia do seu app")
        print()
        
        problem = input("1. Qual problema seu app resolve? ")
        user = input("2. Quem é o usuário-alvo? ")
        name = input("3. Nome do seu app (kebab-case): ")
        description = input("4. Descrição curta: ")
        
        # Interface Visual (UI Guidelines)
        has_ui = input("5. O app terá interface visual? [s/n]: ").lower() == 's'
        
        ui_data = {}
        if has_ui:
            print("\nTipos de interface disponíveis:")
            print("  1. Widget React (cards, listas, gráficos)")
            print("  2. Canvas (visualizações customizadas)")
            print("  3. Form (entrada de dados estruturados)")
            print("  4. Mista (combinação de tipos)")
            
            ui_type_map = {
                "1": "widget",
                "2": "canvas",
                "3": "form",
                "4": "mixed"
            }
            ui_type_num = input("\nTipo de interface [1-4]: ")
            ui_data["ui_type"] = ui_type_map.get(ui_type_num, "widget")
            
            ui_data["ui_components"] = input("Que componentes precisa? (ex: tabela, gráfico): ")
            
            print("\n📖 OpenAI UI Guidelines:")
            print("  ✓ Usar widgets nativos do ChatGPT quando possível")
            print("  ✓ Design responsivo e acessível")
            print("  ✓ Performance otimizada (<100ms render)")
            print("  ✓ Seguir patterns do ChatGPT")
            
            ui_data["use_ui_agent"] = input("\nCriar agente especializado em UI Guidelines? [s/n]: ").lower() == 's'
        
        return {
            "name": name,
            "problem": problem,
            "user": user,
            "description": description,
            "has_ui": has_ui,
            **ui_data
        }
    
    # ============================================
    # PASSO 2: Identify Capabilities (Tools)
    # ============================================
    
    def gather_tools(self) -> List[Dict[str, str]]:
        """
        Define tools seguindo FastMCP style:
        - 1 tool = 1 intention
        - Máximo 3 tools
        - Schemas explícitos
        """
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("🔧 PASSO 2: Defina as tools (funcionalidades)")
        print()
        print("Recomendação FastMCP: 1-3 tools máximo")
        print("Cada tool = 1 ação clara que o usuário quer fazer")
        print()
        
        tool_count = int(input("Quantas tools? [1-3]: "))
        tools = []
        
        for i in range(1, tool_count + 1):
            print(f"\nTool {i}/{tool_count}:")
            name = input("  Nome da tool (snake_case): ")
            description = input("  Descrição (o que faz?): ")
            params = input("  Parâmetros (separados por vírgula ou 'nenhum'): ")
            
            tools.append({
                "name": name,
                "description": description,
                "params": params
            })
        
        return tools
    
    # ============================================
    # PASSO 3: Orchestration (Agentes)
    # ============================================
    
    def gather_agents(self, use_ui_agent: bool) -> tuple[bool, List[Dict[str, str]]]:
        """
        Configura sistema de agentes com golden prompts
        Inclui automaticamente UIGuidelinesAgent se necessário
        """
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("🤖 PASSO 3: Sistema de Agentes (opcional)")
        print()
        
        use_agents = input("Usar sistema de agentes? [s/n]: ").lower() == 's'
        agents = []
        
        if not use_agents:
            return False, []
        
        # Auto-incluir UIGuidelinesAgent se tem UI
        if use_ui_agent:
            agents.append({
                "name": "UIGuidelinesAgent",
                "role": "Especialista em OpenAI UI Guidelines - garante design acessível, responsivo e seguindo patterns do ChatGPT"
            })
            print("✓ UIGuidelinesAgent adicionado automaticamente\n")
        
        extra_count = int(input("Quantos agentes adicionais? [0-3]: "))
        
        for i in range(1, extra_count + 1):
            print(f"\nAgente {i}/{extra_count}:")
            name = input("  Nome do agente: ")
            role = input("  Função/especialidade: ")
            
            agents.append({
                "name": name,
                "role": role
            })
        
        return True, agents
    
    # ============================================
    # GERAÇÃO DE CÓDIGO
    # ============================================
    
    def show_summary(self, app: MCPApp):
        """Exibe resumo do app para confirmação"""
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("📋 RESUMO DO SEU APP")
        print()
        print(f"App: {app.name}")
        print(f"Problema: {app.problem}")
        print(f"Usuário: {app.user}")
        print(f"Descrição: {app.description}")
        
        if app.has_ui:
            print(f"\nInterface: Sim")
            print(f"  Tipo: {app.ui_type}")
            print(f"  Componentes: {app.ui_components}")
            if app.use_ui_agent:
                print(f"  ✓ Com agente de UI Guidelines")
        
        print(f"\nTools ({len(app.tools)}):")
        for i, tool in enumerate(app.tools, 1):
            print(f"  {i}. {tool['name']} - {tool['description']}")
            if tool['params'] != 'nenhum':
                print(f"     Parâmetros: {tool['params']}")
        
        if app.use_agents and app.agents:
            print(f"\nAgentes ({len(app.agents)}):")
            for i, agent in enumerate(app.agents, 1):
                print(f"  {i}. {agent['name']} - {agent['role']}")
        
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    
    def generate_code(self, app: MCPApp) -> str:
        """Gera estrutura completa do app"""
        app_dir = os.path.join(self.apps_dir, app.name)
        os.makedirs(os.path.join(app_dir, "src"), exist_ok=True)
        
        # 1. package.json
        package_json = {
            "name": app.name,
            "version": "1.0.0",
            "description": app.description,
            "type": "module",
            "scripts": {
                "build": "tsc",
                "start": "node dist/index.js",
                "dev": "tsx watch src/index.ts",
                "validate:openai": "npx ts-node ../../builder/src/openai-compliance.ts"
            },
            "dependencies": {
                "@modelcontextprotocol/sdk": "^1.25.1",
                "zod": "^4.2.1"
            },
            "devDependencies": {
                "@types/node": "^22.10.2",
                "typescript": "^5.7.2",
                "tsx": "^4.19.2"
            }
        }
        
        with open(os.path.join(app_dir, "package.json"), "w") as f:
            json.dump(package_json, f, indent=2)
        
        # 2. Copiar template do servidor
        template_path = os.path.join(self.templates_dir, "openai-compliant-server.ts")
        if os.path.exists(template_path):
            subprocess.run([
                "cp", template_path,
                os.path.join(app_dir, "src", "index.ts")
            ])
        
        # 3. Copiar tsconfig.json
        tsconfig_path = os.path.join(self.templates_dir, "tsconfig.json")
        if os.path.exists(tsconfig_path):
            subprocess.run([
                "cp", tsconfig_path,
                os.path.join(app_dir, "tsconfig.json")
            ])
        
        return app_dir
    
    def build_and_validate(self, app_dir: str):
        """Build e validação de compliance"""
        print("\n🔨 Instalando dependências...")
        subprocess.run(["npm", "install"], cwd=app_dir, check=True)
        
        print("🔨 Building servidor...")
        subprocess.run(["npm", "run", "build"], cwd=app_dir, check=True)
        
        print("✅ Validando compliance OpenAI...")
        result = subprocess.run(
            ["npm", "run", "validate:openai"],
            cwd=app_dir,
            capture_output=True,
            text=True
        )
        print(result.stdout)
    
    # ============================================
    # HOOK PRINCIPAL
    # ============================================
    
    def run(self):
        """Executa workflow completo"""
        print("🚀 FastMCP App Builder")
        print("Criador Interativo de Apps MCP")
        print()
        print("Princípios FastMCP:")
        print("  • 1 tool = 1 intention (clara e focada)")
        print("  • Schemas explícitos com Zod")
        print("  • Respostas enxutas e previsíveis")
        print("  • UX nativa do ChatGPT")
        print()
        
        # PASSO 1: Use Case
        use_case = self.gather_use_case()
        
        # PASSO 2: Tools
        tools = self.gather_tools()
        
        # PASSO 3: Agentes
        use_agents, agents = self.gather_agents(use_case.get("use_ui_agent", False))
        
        # Criar objeto MCPApp
        app = MCPApp(
            name=use_case["name"],
            problem=use_case["problem"],
            user=use_case["user"],
            description=use_case["description"],
            has_ui=use_case.get("has_ui", False),
            ui_type=use_case.get("ui_type"),
            ui_components=use_case.get("ui_components"),
            use_ui_agent=use_case.get("use_ui_agent", False),
            tools=tools,
            use_agents=use_agents,
            agents=agents
        )
        
        # Mostrar resumo
        self.show_summary(app)
        
        # Confirmar
        confirm = input("\nConfirmar e gerar código? [s/n]: ").lower()
        if confirm != 's':
            print("❌ Geração cancelada.")
            return
        
        # Gerar código
        print("\n🎨 Gerando código...")
        app_dir = self.generate_code(app)
        
        # Build e validar
        self.build_and_validate(app_dir)
        
        # Mensagem final
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("✅ App criado com sucesso!")
        print()
        print(f"📁 Localização: {app_dir}")
        print()
        print("Próximos passos:")
        print(f"1. cd {app_dir}")
        print("2. npm run dev (testar localmente)")
        print("3. npm run validate:openai (validar compliance)")
        print("4. ../../deploy-fastmcp.sh local (deploy)")
        print()
        print("📚 Documentação:")
        print("  - README.md (instruções de uso)")
        print("  - ../../COMPLETE_GUIDE.md (guia completo)")
        print("  - ../../OPENAI_GUIDELINES.md (compliance)")
        print()
        print("🎉 Seu app segue 100% as OpenAI Apps SDK Guidelines!")


# ============================================
# CONFIGURAÇÃO DO HOOK NO CLAUDE DESKTOP
# ============================================

def register_hook():
    """
    Registra o hook no Claude Desktop
    Adicione ao seu config:
    
    {
      "mcpServers": {
        "fastmcp-builder": {
          "command": "python",
          "args": [
            "/path/to/workflows/claude-hooks/fastmcp_builder_hook.py"
          ],
          "env": {}
        }
      }
    }
    """
    pass


if __name__ == "__main__":
    hook = FastMCPBuilderHook()
    hook.run()
