import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Script, Character, Scene, WorkflowStep } from '../types';

// localStorage key
const SCRIPTS_STORAGE_KEY = 'murderMysteryScripts';
const CURRENT_SCRIPT_ID_KEY = 'currentMurderMysteryScriptId';

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
  // 从 localStorage 获取初始数据
  const getInitialScripts = (): Script[] => {
    const savedScripts = localStorage.getItem(SCRIPTS_STORAGE_KEY);
    if (savedScripts) {
      try {
        const parsedScripts = JSON.parse(savedScripts);
        // 修复日期值（从字符串转回Date对象）
        return parsedScripts.map((script: any) => ({
          ...script,
          createdAt: new Date(script.createdAt),
          updatedAt: new Date(script.updatedAt),
        }));
      } catch (error) {
        console.error('Error parsing scripts from localStorage:', error);
        return [];
      }
    }
    return [];
  };

  const getInitialScriptId = (): string | null => {
    return localStorage.getItem(CURRENT_SCRIPT_ID_KEY);
  };

  const [scripts, setScripts] = useState<Script[]>(getInitialScripts);
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(getInitialScriptId);

  // 当scripts变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem(SCRIPTS_STORAGE_KEY, JSON.stringify(scripts));
  }, [scripts]);

  // 当currentScriptId变化时，保存到localStorage
  useEffect(() => {
    if (currentScriptId) {
      localStorage.setItem(CURRENT_SCRIPT_ID_KEY, currentScriptId);
    } else {
      localStorage.removeItem(CURRENT_SCRIPT_ID_KEY);
    }
  }, [currentScriptId]);

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
    const scriptWithUpdatedDate = {
      ...updatedScript,
      updatedAt: new Date()
    };
    
    setScripts(scripts.map(script => 
      script.id === updatedScript.id 
        ? scriptWithUpdatedDate
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