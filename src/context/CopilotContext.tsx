import { createContext, useContext, useState, ReactNode } from 'react';
import { KnowledgeFragment } from '../types';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  referencedFragments?: string[]; // IDs of referenced knowledge fragments
}

interface CopilotContextType {
  messages: Message[];
  knowledgeFragments: KnowledgeFragment[];
  sendMessage: (content: string, referencedFragments?: string[]) => void;
  generateDraft: (prompt: string) => void;
  uploadKnowledgeFragment: (title: string, content: string, source: string, tags: string[]) => void;
  searchKnowledgeFragments: (query: string) => KnowledgeFragment[];
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export const useCopilotContext = () => {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error('useCopilotContext must be used within a CopilotProvider');
  }
  return context;
};

export const CopilotProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [knowledgeFragments, setKnowledgeFragments] = useState<KnowledgeFragment[]>([]);

  // In a real app, this would interact with an API
  const mockAssistantResponse = (userMessage: string): string => {
    const responses = [
      "I can help you develop that character further. What aspects are you struggling with?",
      "That's an interesting plot twist. Consider how it might affect the relationships between characters.",
      "For this scene, you might want to build more tension before the reveal.",
      "I've analyzed your script and found some inconsistencies in character motivations.",
      "Based on your outline, here's a draft for the confrontation scene you requested.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = (content: string, referencedFragments: string[] = []) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: new Date(),
      referencedFragments,
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const assistantResponse = mockAssistantResponse(content);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: assistantResponse,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    }, 1000);
  };

  const generateDraft = (prompt: string) => {
    // In a real app, this would call an API with more sophisticated AI
    sendMessage(`[DRAFT REQUEST] ${prompt}`);
  };

  const uploadKnowledgeFragment = (title: string, content: string, source: string, tags: string[]) => {
    const newFragment: KnowledgeFragment = {
      id: crypto.randomUUID(),
      title,
      content,
      tags,
      source,
      createdAt: new Date(),
    };
    
    setKnowledgeFragments([...knowledgeFragments, newFragment]);
  };

  const searchKnowledgeFragments = (query: string): KnowledgeFragment[] => {
    // Basic search implementation
    const lowerQuery = query.toLowerCase();
    return knowledgeFragments.filter(fragment => 
      fragment.title.toLowerCase().includes(lowerQuery) || 
      fragment.content.toLowerCase().includes(lowerQuery) ||
      fragment.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const value = {
    messages,
    knowledgeFragments,
    sendMessage,
    generateDraft,
    uploadKnowledgeFragment,
    searchKnowledgeFragments,
  };

  return (
    <CopilotContext.Provider value={value}>
      {children}
    </CopilotContext.Provider>
  );
}; 