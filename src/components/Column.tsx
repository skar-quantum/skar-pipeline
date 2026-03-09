'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from './Card';

interface CardData {
  id: string;
  title: string;
  frente: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  challengeId: string;
}

interface ColumnProps {
  id: string;
  name: string;
  color: string;
  cards: CardData[];
  challenges: Record<string, { color: string }>;
}

export function Column({ id, name, color, cards, challenges }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={`
        flex flex-col bg-zinc-900/50 rounded-xl min-w-[280px] max-w-[280px]
        border border-zinc-800 transition-all duration-200
        ${isOver ? 'border-zinc-600 bg-zinc-900/80' : ''}
      `}
    >
      <div 
        className="p-3 border-b border-zinc-800 flex items-center gap-2"
        style={{ borderTopColor: color, borderTopWidth: '3px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
      >
        <span className="text-sm font-semibold text-white">{name}</span>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
          {cards.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className="flex-1 p-2 space-y-2 min-h-[200px] overflow-y-auto"
      >
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              title={card.title}
              frente={card.frente}
              priority={card.priority}
              description={card.description}
              challengeColor={challenges[card.challengeId]?.color || '#6B7280'}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
