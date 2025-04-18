export type WorkflowStep = 
  | 'outline'
  | 'characters'
  | 'relationships'
  | 'clues'
  | 'scenes'
  | 'draft'
  | 'refinement';

export interface Script {
  id: string;
  title: string;
  outline: string;
  currentStep: WorkflowStep;
  createdAt: number;
  updatedAt: number;
}

export interface Character {
  name: string;
  description: string;
  background: string;
  relationships?: Record<string, string>; // characterId -> relationship description
}

export interface Relationship {
  source: string; // character id
  target: string; // character id
  description: string;
  type: string; // 关系类型，如"朋友"、"敌人"等
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  characters: string[]; // character names
  clues: string[]; // clue ids
  content: string;
  order: number;
}

export interface KnowledgeFragment {
  id: string;
  title: string;
  content: string;
  tags: string[];
  source: string;
  createdAt?: number;
}

export interface CopilotMessage {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: number;
  fragmentIds?: string[];
}

export interface ClueItem {
  id: string;
  name: string;
  description: string;
  relatedCharacters: string[]; // character names
  importance: 'high' | 'medium' | 'low';
  revealInScene?: string; // scene id
} 