import { API_URL } from '../config/config';
// components/DevPanel.tsx
// Panneau de dev visible UNIQUEMENT en local (import.meta.env.DEV)
// Permet de lancer l'agent IA d'optimisation des requêtes en un clic

import { useState } from 'react';
import { analyzeQueryPerformance, metricsCollector, OptimizationReport } from '../agents/queryOptimizer';

export function DevPanel() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<OptimizationReport | null>(null);

  // N'affiche rien en production
  if (!import.meta.env.DEV) return null;

  async function runAnalysis() {
    setLoading(true);
    setReport(null);
    const result = await analyzeQueryPerformance();
    setReport(result);
    setLoading(false);
  }

  const metrics = metricsCollector.getRecent(5);

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          background: '#1a1a2e',
          color: '#e2e2e2',
          border: '1px solid #444',
          borderRadius: 8,
          padding: '8px 14px',
          fontSize: 13,
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        🤖 Agent IA {open ? '✕' : '↗'}
      </button>

      {/* Panneau */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 56,
          right: 16,
          zIndex: 9999,
          width: 420,
          maxHeight: '70vh',
          overflowY: 'auto',
          background: '#1a1a2e',
          color: '#e2e2e2',
          border: '1px solid #444',
          borderRadius: 12,
          padding: 16,
          fontFamily: 'monospace',
          fontSize: 12,
        }}>
          <h3 style={{ margin: '0 0 12px', color: '#a78bfa' }}>🤖 Agent Optimisation Requêtes</h3>

          {/* Métriques récentes */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: '#888', marginBottom: 4 }}>Requêtes récentes ({metrics.length})</div>
            {metrics.length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic' }}>Navigue sur le site pour collecter des métriques…</div>
            ) : (
              metrics.map((m, i) => (
                <div key={i} style={{ padding: '3px 0', borderBottom: '1px solid #2a2a3e' }}>
                  <span style={{ color: m.status === 'success' ? '#4ade80' : '#f87171' }}>
                    {m.status === 'success' ? '✓' : '✗'}
                  </span>{' '}
                  <span style={{ color: '#93c5fd' }}>{m.durationMs}ms</span>{' '}
                  <span style={{ color: '#d1d5db', wordBreak: 'break-all' }}>
                    {m.endpoint.replace('' + API_URL + '', '')}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Bouton analyse */}
          <button
            onClick={runAnalysis}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px 0',
              background: loading ? '#374151' : '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            {loading ? '⏳ Analyse en cours (Claude Opus 4.6)…' : '🔍 Lancer l\'analyse IA'}
          </button>

          {/* Rapport */}
          {report && (
            <div>
              <div style={{ color: '#fbbf24', marginBottom: 8 }}>
                📋 Rapport — {new Date(report.analysedAt).toLocaleTimeString('fr-FR')}
              </div>
              <div style={{ color: '#d1d5db', marginBottom: 10, lineHeight: 1.5 }}>
                {report.summary}
              </div>

              {report.suggestions.length === 0 && (
                <div style={{ color: '#6b7280' }}>Aucune suggestion (pas assez de données).</div>
              )}

              {report.suggestions.map((s, i) => (
                <div key={i} style={{
                  marginBottom: 8,
                  padding: 8,
                  borderRadius: 6,
                  background: s.priority === 'high' ? '#450a0a' : s.priority === 'medium' ? '#422006' : '#1e3a1e',
                  border: `1px solid ${s.priority === 'high' ? '#7f1d1d' : s.priority === 'medium' ? '#78350f' : '#14532d'}`,
                }}>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{
                      background: s.priority === 'high' ? '#dc2626' : s.priority === 'medium' ? '#d97706' : '#16a34a',
                      color: 'white',
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontSize: 10,
                      marginRight: 6,
                    }}>
                      {s.priority.toUpperCase()}
                    </span>
                    <span style={{ color: '#93c5fd' }}>[{s.type}]</span>
                  </div>
                  <div style={{ color: '#e2e2e2', marginBottom: 4, lineHeight: 1.4 }}>{s.suggestion}</div>
                  <div style={{ color: '#6b7280', fontSize: 11 }}>💡 {s.estimatedGain}</div>
                </div>
              ))}

              {report.thinkingProcess && (
                <details style={{ marginTop: 8 }}>
                  <summary style={{ color: '#6b7280', cursor: 'pointer' }}>💭 Raisonnement Claude</summary>
                  <pre style={{ color: '#4b5563', fontSize: 10, whiteSpace: 'pre-wrap', marginTop: 6, maxHeight: 200, overflowY: 'auto' }}>
                    {report.thinkingProcess}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
