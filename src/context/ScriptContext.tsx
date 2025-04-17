import { createContext, useContext, useState, ReactNode } from 'react';
import { Script, Character, Scene, WorkflowStep } from '../types';

interface ScriptContextType {
  scripts: Script[];
  currentScript: Script | null;
  createScript: (title: string, description: string) => void;
  updateScript: (updatedScript: Script) => void;
  selectScript: (scriptId: string) => void;
  addCharacter: (character: Omit<Character, 'id' | 'relationships'>) => void;
  updateCharacter: (character: Character) => void;
  addScene: (scene: Omit<Scene, 'id' | 'order'>) => void;
  updateScene: (scene: Scene) => void;
  updateOutline: (outline: string) => void;
  setWorkflowStep: (step: WorkflowStep) => void;
  saveEditPosition: (position: Script['lastEditPosition']) => void;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

export const useScriptContext = () => {
  const context = useContext(ScriptContext);
  if (!context) {
    throw new Error('useScriptContext must be used within a ScriptProvider');
  }
  return context;
};

export const ScriptProvider = ({ children }: { children: ReactNode }) => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(null);

  const currentScript = currentScriptId 
    ? scripts.find(script => script.id === currentScriptId) || null
    : null;

  const createScript = (title: string, description: string) => {
    const newScript: Script = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      characters: [],
      scenes: [],
      outline: '',
      currentStep: 'outline',
    };
    
    setScripts([...scripts, newScript]);
    setCurrentScriptId(newScript.id);
  };

  const updateScript = (updatedScript: Script) => {
    setScripts(scripts.map(script => 
      script.id === updatedScript.id 
        ? { ...updatedScript, updatedAt: new Date() } 
        : script
    ));
  };

  const selectScript = (scriptId: string) => {
    setCurrentScriptId(scriptId);
  };

  const addCharacter = (character: Omit<Character, 'id' | 'relationships'>) => {
    if (!currentScript) return;
    
    const newCharacter: Character = {
      ...character,
      id: crypto.randomUUID(),
      relationships: [],
    };
    
    updateScript({
      ...currentScript,
      characters: [...currentScript.characters, newCharacter],
    });
  };

  const updateCharacter = (character: Character) => {
    if (!currentScript) return;
    
    updateScript({
      ...currentScript,
      characters: currentScript.characters.map(c => 
        c.id === character.id ? character : c
      ),
    });
  };

  const addScene = (scene: Omit<Scene, 'id' | 'order'>) => {
    if (!currentScript) return;
    
    const newScene: Scene = {
      ...scene,
      id: crypto.randomUUID(),
      order: currentScript.scenes.length,
    };
    
    updateScript({
      ...currentScript,
      scenes: [...currentScript.scenes, newScene],
    });
  };

  const updateScene = (scene: Scene) => {
    if (!currentScript) return;
    
    updateScript({
      ...currentScript,
      scenes: currentScript.scenes.map(s => 
        s.id === scene.id ? scene : s
      ),
    });
  };

  const updateOutline = (outline: string) => {
    if (!currentScript) return;
    
    updateScript({
      ...currentScript,
      outline,
    });
  };

  const setWorkflowStep = (step: WorkflowStep) => {
    if (!currentScript) return;
    
    updateScript({
      ...currentScript,
      currentStep: step,
    });
  };

  const saveEditPosition = (position: Script['lastEditPosition']) => {
    if (!currentScript) return;
    
    updateScript({
      ...currentScript,
      lastEditPosition: position,
    });
  };

  const value = {
    scripts,
    currentScript,
    createScript,
    updateScript,
    selectScript,
    addCharacter,
    updateCharacter,
    addScene,
    updateScene,
    updateOutline,
    setWorkflowStep,
    saveEditPosition,
  };

  return (
    <ScriptContext.Provider value={value}>
      {children}
    </ScriptContext.Provider>
  );
};