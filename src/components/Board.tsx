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
import data from '@/data/challenges.json';

interface CardData {
  id: string;
  challengeId: string;
  columnId: string;
  title: string;
  frente: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

export function Board() {
  const [cards, setCards] = useState<CardData[]>(data.cards as CardData[]);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<string>('all');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const challenges = Object.fromEntries(
    data.challenges.map((c) => [c.id, { color: c.color, name: c.name, emoji: c.emoji }])
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

    const activeCard = cards.find((c) => c.id === activeId);
    const overCard = cards.find((c) => c.id === overId);

    if (!activeCard) return;

    // If over a column
    if (data.columns.some((col) => col.id === overId)) {
      if (activeCard.columnId !== overId) {
        setCards((cards) =>
          cards.map((c) =>
            c.id === activeId ? { ...c, columnId: overId } : c
          )
        );
      }
      return;
    }

    // If over another card
    if (overCard && activeCard.columnId !== overCard.columnId) {
      setCards((cards) =>
        cards.map((c) =>
          c.id === activeId ? { ...c, columnId: overCard.columnId } : c
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeCard = cards.find((c) => c.id === activeId);
    const overCard = cards.find((c) => c.id === overId);

    if (!activeCard) return;

    // Reorder within column
    if (overCard && activeCard.columnId === overCard.columnId) {
      const columnCards = cards.filter((c) => c.columnId === activeCard.columnId);
      const activeIndex = columnCards.findIndex((c) => c.id === activeId);
      const overIndex = columnCards.findIndex((c) => c.id === overId);

      if (activeIndex !== overIndex) {
        setCards((cards) => {
          const newColumnCards = arrayMove(columnCards, activeIndex, overIndex);
          const otherCards = cards.filter((c) => c.columnId !== activeCard.columnId);
          return [...otherCards, ...newColumnCards];
        });
      }
    }
  };

  // Save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('skar-pipeline-cards');
    if (saved) {
      setCards(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('skar-pipeline-cards', JSON.stringify(cards));
  }, [cards]);

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">⚡ Skar Pipeline</h1>
        <p className="text-zinc-400 text-sm">Gestão de Challenges do Skar Quantum</p>
      </div>

      {/* Challenge Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setSelectedChallenge('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedChallenge === 'all'
              ? 'bg-white text-black'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          Todos
        </button>
        {data.challenges.map((challenge) => (
          <button
            key={challenge.id}
            onClick={() => setSelectedChallenge(challenge.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              selectedChallenge === challenge.id
                ? 'text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
            style={{
              backgroundColor: selectedChallenge === challenge.id ? challenge.color : undefined,
            }}
          >
            <span>{challenge.emoji}</span>
            <span>{challenge.name}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {data.columns.map((col) => {
          const count = getColumnCards(col.id).length;
          return (
            <div
              key={col.id}
              className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800"
            >
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-xs text-zinc-400">{col.name}</div>
            </div>
          );
        })}
      </div>

      {/* Board */}
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
              challenges={challenges}
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
              description={activeCard.description}
              challengeColor={challenges[activeCard.challengeId]?.color || '#6B7280'}
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="font-medium">Frentes:</span>
          <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Intel</span>
          <span className="bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded">Neon</span>
          <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Design</span>
          <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">Site</span>
          <span className="bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">Ops</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Prioridade:</span>
          <span>🔴 Alta</span>
          <span>🟡 Média</span>
          <span>🟢 Baixa</span>
        </div>
      </div>
    </div>
  );
}
