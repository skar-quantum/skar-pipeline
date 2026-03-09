'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardProps {
  id: string;
  title: string;
  frente: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  challengeEmoji: string;
}

const frenteColors: Record<string, string> = {
  Intel: '#a855f7',
  Neon: '#00ff00',
  Design: '#3b82f6',
  Site: '#06b6d4',
  Ops: '#6b7280',
};

export function Card({ id, title, frente, priority, challengeEmoji }: CardProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-[#111] rounded-lg p-3 cursor-grab active:cursor-grabbing
        border border-[#1f1f1f] hover:border-[#333] transition-all duration-150
        group
        ${isDragging ? 'opacity-50 shadow-xl scale-[1.02]' : ''}
      `}
    >
      {/* Title row */}
      <div className="flex items-start gap-2">
        <span className="text-[#555] text-sm">☰</span>
        <h4 className="text-sm text-white leading-tight flex-1">{title}</h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-[#555] hover:text-white p-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
          <button className="text-[#555] hover:text-red-400 p-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
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
