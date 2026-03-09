export interface Direcionais {
  objetivo: string;
  contexto: string;
  passos: string[];
  entregaveis: string[];
  metricas_sucesso: string[];
  dependencias: string[];
  responsavel: string;
  prazo_sugerido: string;
}

export interface CardData {
  id: string;
  challengeId: string;
  columnId: string;
  title: string;
  frente: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  direcionais?: Direcionais;
}

export interface Challenge {
  id: string;
  name: string;
  emoji: string;
  goal: string;
  color: string;
}

export interface Column {
  id: string;
  name: string;
  color: string;
}
