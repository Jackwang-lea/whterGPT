export interface Character {
  id: string;
  name: string;
  description: string;
  background: string;
  relationships: Relationship[];
}

export interface Relationship {
  targetId: string;
  type: string;
  description: string;
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  characters: string[]; // Character IDs
  content: string;
  order: number;
}

export interface Script {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  characters: Character[];
  scenes: Scene[];
  outline: string;
  currentStep: WorkflowStep;
  lastEditPosition?: {
    sceneId?: string;
    characterId?: string;
    cursorPosition?: number;
  };
}

export type WorkflowStep = 
  | 'outline'
  | 'characters'
  | 'relationships'
  | 'scenes'
  | 'draft';

export interface KnowledgeFragment {
  id: string;
  title: string;
  content: string;
  tags: string[];
  source: string;
  createdAt: Date;
} 