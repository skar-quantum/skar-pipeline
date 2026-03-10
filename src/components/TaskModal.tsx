'use client';

import { useEffect } from 'react';
import { Direcionais } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  frente: string;
  priority: 'high' | 'medium' | 'low';
  direcionais?: Direcionais;
}

const frenteColors: Record<string, string> = {
  Intel: '#a855f7',
  Neon: '#00ff00',
  Design: '#3b82f6',
  Site: '#06b6d4',
  Ops: '#6b7280',
};

export function TaskModal({ 
  isOpen, 
  onClose, 
  title, 
  frente, 
  priority,
  direcionais 
}: TaskModalProps) {
  const frenteColor = frenteColors[frente] || '#6b7280';

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-3xl bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#1f1f1f]">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs px-2 py-0.5 rounded font-medium border"
                style={{ 
                  borderColor: frenteColor,
                  color: frenteColor,
                }}
              >
                {frente}
              </span>
              {priority === 'high' && (
                <span className="text-xs px-2 py-0.5 rounded border border-red-500 text-red-400">
                  urgent
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors p-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {direcionais ? (
            <>
              {/* Objetivo */}
              <section>
                <h3 className="text-sm font-semibold text-[#00ff00] uppercase tracking-wide mb-2">
                  Objetivo
                </h3>
                <p className="text-[#ccc] leading-relaxed">{direcionais.objetivo}</p>
              </section>

              {/* Contexto */}
              <section>
                <h3 className="text-sm font-semibold text-[#00ff00] uppercase tracking-wide mb-2">
                  Contexto
                </h3>
                <p className="text-[#ccc] leading-relaxed">{direcionais.contexto}</p>
              </section>

              {/* Passos */}
              <section>
                <h3 className="text-sm font-semibold text-[#00ff00] uppercase tracking-wide mb-3">
                  Passos para Execução
                </h3>
                <ol className="space-y-2">
                  {direcionais.passos.map((passo, i) => (
                    <li key={i} className="flex gap-3 text-[#ccc]">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full border border-[#333] text-xs flex items-center justify-center text-[#888]">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed pt-0.5">{passo}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Entregáveis */}
              <section>
                <h3 className="text-sm font-semibold text-[#00ff00] uppercase tracking-wide mb-3">
                  Entregáveis
                </h3>
                <ul className="space-y-2">
                  {direcionais.entregaveis.map((item, i) => (
                    <li key={i} className="flex gap-2 text-[#ccc]">
                      <span className="text-[#00ff00]">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Métricas de Sucesso */}
              <section>
                <h3 className="text-sm font-semibold text-[#00ff00] uppercase tracking-wide mb-3">
                  Métricas de Sucesso
                </h3>
                <ul className="space-y-2">
                  {direcionais.metricas_sucesso.map((metrica, i) => (
                    <li key={i} className="flex gap-2 text-[#ccc]">
                      <span className="text-[#f59e0b]">-</span>
                      <span>{metrica}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Info Footer */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1f1f1f]">
                <div>
                  <span className="text-xs text-[#555] uppercase tracking-wide">Dependências</span>
                  <div className="mt-1 space-y-1">
                    {direcionais.dependencias.map((dep, i) => (
                      <p key={i} className="text-sm text-[#888]">{dep}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-[#555] uppercase tracking-wide">Responsável</span>
                  <p className="text-sm text-white mt-1">{direcionais.responsavel}</p>
                </div>
                <div>
                  <span className="text-xs text-[#555] uppercase tracking-wide">Prazo Sugerido</span>
                  <p className="text-sm text-white mt-1">{direcionais.prazo_sugerido}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-[#555]">Nenhum direcional cadastrado para esta task.</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#1f1f1f]">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm border border-[#333] text-[#888] rounded-md hover:text-white hover:border-[#555] transition-colors"
          >
            Fechar
          </button>
          <button className="px-4 py-2 text-sm border border-[#00ff00] text-[#00ff00] rounded-md font-medium hover:bg-[#00ff00]/10 transition-colors">
            Mover para Em Progresso
          </button>
        </div>
      </div>
    </div>
  );
}
