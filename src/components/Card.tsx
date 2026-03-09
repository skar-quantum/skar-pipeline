'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardProps {
  id: string;
  title: string;
  frente: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  challengeColor: string;
}

const priorityStyles = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const frenteStyles: Record<string, string> = {
  Intel: 'bg-purple-500/20 text-purple-400',
  Neon: 'bg-pink-500/20 text-pink-400',
  Design: 'bg-blue-500/20 text-blue-400',
  Site: 'bg-cyan-500/20 text-cyan-400',
  Ops: 'bg-gray-500/20 text-gray-400',
};

export function Card({ id, title, frente, priority, description, challengeColor }: CardProps) {
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
    borderLeftColor: challengeColor,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-zinc-800/80 rounded-lg p-3 border-l-4 cursor-grab active:cursor-grabbing
        hover:bg-zinc-700/80 transition-all duration-200
        ${isDragging ? 'opacity-50 shadow-2xl scale-105' : 'shadow-md'}
      `}
    >
      <h4 className="text-sm font-medium text-white mb-2 leading-tight">{title}</h4>
      
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full ${frenteStyles[frente] || frenteStyles.Ops}`}>
          {frente}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityStyles[priority]}`}>
          {priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢'}
        </span>
      </div>
      
      {description && (
        <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{description}</p>
      )}
    </div>
  );
}
