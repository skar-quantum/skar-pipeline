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
  const [cards, setCards] = useState<CardData[]>(data.cards as CardData[]);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<CardData | null>(null);

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
        setCards((prevCards) =>
          prevCards.map((c) => (c.id === activeId ? { ...c, columnId: overId } : c))
        );
      }
      return;
    }

    if (overCard && activeCardItem.columnId !== overCard.columnId) {
      setCards((prevCards) =>
        prevCards.map((c) => (c.id === activeId ? { ...c, columnId: overCard.columnId } : c))
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeCardItem = cards.find((c) => c.id === activeId);
    const overCard = cards.find((c) => c.id === overId);

    if (!activeCardItem) return;

    if (overCard && activeCardItem.columnId === overCard.columnId) {
      const columnCards = cards.filter((c) => c.columnId === activeCardItem.columnId);
      const activeIndex = columnCards.findIndex((c) => c.id === activeId);
      const overIndex = columnCards.findIndex((c) => c.id === overId);

      if (activeIndex !== overIndex) {
        setCards((prevCards) => {
          const newColumnCards = arrayMove(columnCards, activeIndex, overIndex);
          const otherCards = prevCards.filter((c) => c.columnId !== activeCardItem.columnId);
          return [...otherCards, ...newColumnCards];
        });
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('skar-pipeline-cards');
    if (saved) setCards(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('skar-pipeline-cards', JSON.stringify(cards));
  }, [cards]);

  const handleOpenTask = (card: CardData) => {
    setSelectedTask(card);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-[#1f1f1f] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Pipeline
            </h1>
            <p className="text-sm text-[#555] mt-0.5">
              Kanban de mudanças e backlog — gerenciado pela Skar
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#00ff00] text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-[#00cc00] transition-colors">
            <span>+</span>
            Nova Task
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedChallenge('all')}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              selectedChallenge === 'all'
                ? 'bg-[#00ff00] text-black font-medium'
                : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            Todos
          </button>
          {data.challenges.map((challenge) => (
            <button
              key={challenge.id}
              onClick={() => setSelectedChallenge(challenge.id)}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                selectedChallenge === challenge.id
                  ? 'bg-[#00ff00] text-black font-medium'
                  : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              {challenge.name}
            </button>
          ))}
        </div>
      </div>

      {/* Board */}
      <div className="p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
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
