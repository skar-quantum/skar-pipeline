'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Direcionais {
  objetivo: string;
  contexto: string;
  passos: string[];
  entregaveis: string[];
  metricas_sucesso: string[];
  dependencias: string[];
  responsavel: string;
  prazo_sugerido: string;
}

interface CardProps {
  id: string;
  title: string;
  frente: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  challengeEmoji: string;
  direcionais?: Direcionais;
  onOpenModal?: () => void;
}

const frenteColors: Record<string, string> = {
  Intel: '#a855f7',
  Neon: '#00ff00',
  Design: '#3b82f6',
  Site: '#06b6d4',
  Ops: '#6b7280',
};

export function Card({ id, title, frente, priority, challengeEmoji, direcionais, onOpenModal }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const frenteColor = frenteColors[frente] || '#6b7280';

  const handleClick = (e: React.MouseEvent) => {
    // Only open modal on click, not drag
    if (!isDragging && onOpenModal) {
      onOpenModal();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`
        bg-[#111] rounded-lg p-3 cursor-pointer
        border border-[#1f1f1f] hover:border-[#333] transition-all duration-150
        group
        ${isDragging ? 'opacity-50 shadow-xl scale-[1.02] cursor-grabbing' : ''}
      `}
    >
      {/* Title row */}
      <div className="flex items-start gap-2">
        <span className="text-[#555] text-sm">☰</span>
        <h4 className="text-sm text-white leading-tight flex-1">{title}</h4>
        {direcionais && (
          <span className="text-[#00ff00] text-xs opacity-60 group-hover:opacity-100 transition-opacity">
            📋
          </span>
        )}
      </div>

      {/* Tags row */}
      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        <span
          className="text-xs px-2 py-0.5 rounded font-medium"
          style={{ 
            backgroundColor: `${frenteColor}20`,
            color: frenteColor,
          }}
        >
          {challengeEmoji} {frente}
        </span>
        {priority === 'high' && (
          <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">
            urgent
          </span>
        )}
      </div>
    </div>
  );
}
