'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column } from './Column';
import { Card } from './Card';
import { TaskModal } from './TaskModal';
import { CardData } from '@/types';
import data from '@/data/challenges.json';

export function Board() {
  const [cardPositions, setCardPositions] = useState<Record<string, string>>({});
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<CardData | null>(null);

  const cards: CardData[] = (data.cards as CardData[]).map(card => ({
    ...card,
    columnId: cardPositions[card.id] || card.columnId
  }));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const challenges = Object.fromEntries(
    data.challenges.map((c) => [c.id, { color: c.color, name: c.name }])
  );

  const filteredCards = selectedChallenge === 'all' 
    ? cards 
    : cards.filter(c => c.challengeId === selectedChallenge);

  const getColumnCards = (columnId: string) => {
    return filteredCards.filter((card) => card.columnId === columnId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeCardItem = cards.find((c) => c.id === activeId);
    const overCard = cards.find((c) => c.id === overId);

    if (!activeCardItem) return;

    if (data.columns.some((col) => col.id === overId)) {
      if (activeCardItem.columnId !== overId) {
        setCardPositions(prev => ({ ...prev, [activeId]: overId }));
      }
      return;
    }

    if (overCard && activeCardItem.columnId !== overCard.columnId) {
      setCardPositions(prev => ({ ...prev, [activeId]: overCard.columnId }));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
  };

  useEffect(() => {
    const saved = localStorage.getItem('skar-pipeline-positions');
    if (saved) {
      try {
        setCardPositions(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(cardPositions).length > 0) {
      localStorage.setItem('skar-pipeline-positions', JSON.stringify(cardPositions));
    }
  }, [cardPositions]);

  const handleOpenTask = (card: CardData) => {
    setSelectedTask(card);
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-[#1f1f1f] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Pipeline
            </h1>
            <p className="text-sm text-[#555] mt-0.5">
              Kanban de mudanças e backlog — gerenciado pela Skar
            </p>
          </div>
          <button className="flex items-center gap-2 border border-[#00ff00] text-[#00ff00] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#00ff00]/10 transition-colors">
            <span>+</span>
            Nova Task
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedChallenge('all')}
            className={`px-3 py-1.5 rounded text-sm transition-colors border ${
              selectedChallenge === 'all'
                ? 'border-[#00ff00] text-[#00ff00]'
                : 'border-[#333] text-[#888] hover:text-white hover:border-[#555]'
            }`}
          >
            Todos
          </button>
          {data.challenges.map((challenge) => (
            <button
              key={challenge.id}
              onClick={() => setSelectedChallenge(challenge.id)}
              className={`px-3 py-1.5 rounded text-sm transition-colors border ${
                selectedChallenge === challenge.id
                  ? 'border-[#00ff00] text-[#00ff00]'
                  : 'border-[#333] text-[#888] hover:text-white hover:border-[#555]'
              }`}
            >
              {challenge.name}
            </button>
          ))}
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 min-h-0 p-6 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full min-h-0">
            {data.columns.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                name={column.name}
                color={column.color}
                cards={getColumnCards(column.id)}
                onOpenTask={handleOpenTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCard && (
              <Card
                id={activeCard.id}
                title={activeCard.title}
                frente={activeCard.frente}
                priority={activeCard.priority}
                direcionais={activeCard.direcionais}
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || ''}
        frente={selectedTask?.frente || ''}
        priority={selectedTask?.priority || 'medium'}
        direcionais={selectedTask?.direcionais}
      />
    </div>
  );
}
