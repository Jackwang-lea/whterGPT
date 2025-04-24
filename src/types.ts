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
  characters?: Character[];
  scenes?: Scene[];
  description?: string;
  lastEditPosition?: {
    step: WorkflowStep;
    position: number;
  };
}

export interface Character {
  id: string;
  name: string;
  description: string;
  background: string;
  relationships: Relationship[];
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
  characters: string[]; // character ids
  clues?: string[]; // clue ids
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