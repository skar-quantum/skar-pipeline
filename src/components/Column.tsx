'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from './Card';
import { CardData } from '@/types';

interface ColumnProps {
  id: string;
  name: string;
  color: string;
  cards: CardData[];
  onOpenTask: (card: CardData) => void;
}

const columnColors: Record<string, string> = {
  backlog: '#888888',
  execucao: '#f59e0b',
  done: '#00ff00',
};

export function Column({ id, name, color, cards, onOpenTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const dotColor = columnColors[id] || color;

  return (
    <div
      className={`
        flex flex-col min-w-[300px] max-w-[300px]
        transition-all duration-200
        ${isOver ? 'opacity-80' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
        <span className="text-sm font-medium text-white">{name}</span>
        <span className="text-xs text-[#555] ml-1">({cards.length})</span>
        <button className="ml-auto text-[#555] hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className="flex-1 space-y-2 min-h-[400px]"
      >
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              title={card.title}
              frente={card.frente}
              priority={card.priority}
              direcionais={card.direcionais}
              onOpenModal={() => onOpenTask(card)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
