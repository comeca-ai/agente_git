/**
 * Widget React - Bible Daily App
 * Integrates with window.openai for ChatGPT App
 */

import { useState, useEffect } from 'react'
import './App.css'

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    openai?: {
      toolOutput?: {
        verse?: Verse;
      };
      toolResponseMetadata?: {
        verse?: Verse;
      };
      widgetState?: Record<string, unknown>;
      setWidgetState?: (state: Record<string, unknown>) => void;
      callTool?: (toolName: string, args: Record<string, unknown>) => Promise<unknown>;
    };
  }
}

function App() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Read verse from tool output
    if (window.openai?.toolOutput?.verse) {
      setVerse(window.openai.toolOutput.verse);
    } else if (window.openai?.toolResponseMetadata?.verse) {
      // Also check _meta for verse data
      setVerse(window.openai.toolResponseMetadata.verse);
    }

    // Initialize widget state (small payload, no secrets)
    if (window.openai?.setWidgetState) {
      window.openai.setWidgetState({
        initialized: true,
        lastUpdate: new Date().toISOString(),
      });
    }
  }, []);

  const handleRefresh = async () => {
    if (!window.openai?.callTool) {
      console.warn('window.openai.callTool not available');
      return;
    }

    setLoading(true);
    try {
      // Call tool directly from widget (requires widgetAccessible: true)
      await window.openai.callTool('obter_versiculo_diario', {});
    } catch (error) {
      console.error('Error calling tool:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h2>📖 Bíblia Diária</h2>
      
      {verse ? (
        <div style={{
          background: '#f5f5f5',
          padding: '16px',
          borderRadius: '8px',
          margin: '16px 0'
        }}>
          <div style={{
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            {verse.book} {verse.chapter}:{verse.verse}
          </div>
          <div style={{
            color: '#555',
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            {verse.text}
          </div>
        </div>
      ) : (
        <p style={{ color: '#666' }}>
          Peça um versículo ao ChatGPT para começar!
        </p>
      )}

      {window.openai?.callTool && (
        <button
          onClick={handleRefresh}
          disabled={loading}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '8px',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Carregando...' : '🔄 Novo Versículo'}
        </button>
      )}

      <p style={{ 
        fontSize: '12px', 
        color: '#888', 
        marginTop: '16px',
        fontStyle: 'italic'
      }}>
        Widget carregado com sucesso. Use window.openai API.
      </p>
    </div>
  )
}

export default App

