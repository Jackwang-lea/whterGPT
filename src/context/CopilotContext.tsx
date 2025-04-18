import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { KnowledgeFragment, CopilotMessage } from '../types';

// 模拟知识片段数据
const mockKnowledgeFragments: KnowledgeFragment[] = [
  {
    id: 'k1',
    title: '场景设计原则',
    content: '一个好的场景设计应该包含明确的目的、情感氛围和至少一个冲突点。',
    tags: ['场景', '设计', '剧本'],
    source: '剧本创作指南',
    createdAt: Date.now() - 86400000 * 2, // 2天前
  },
  {
    id: 'k2',
    title: '角色弧光',
    content: '角色弧光是指角色在故事中的成长和变化。一个有深度的角色应该在故事结束时与开始时有所不同。',
    tags: ['角色', '弧光', '发展'],
    source: '人物塑造技巧',
    createdAt: Date.now() - 86400000, // 1天前
  },
  {
    id: 'k3',
    title: '悬疑剧本结构',
    content: '悬疑剧本通常有一个扣人心弦的开场、逐渐展开的线索和出人意料但合理的结局。',
    tags: ['悬疑', '结构', '剧本'],
    source: '悬疑写作指南',
    createdAt: Date.now(), // 今天
  },
];

interface CopilotContextType {
  messages: CopilotMessage[];
  sendMessage: (content: string, fragmentIds?: string[], role?: 'user' | 'ai') => void;
  clearMessages: () => void;
  generateDraft: (prompt: string) => Promise<string>;
  knowledgeFragments: KnowledgeFragment[];
  searchKnowledgeFragments: (query: string) => KnowledgeFragment[];
}

const CopilotContext = createContext<CopilotContextType | null>(null);

export const CopilotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [knowledgeFragments] = useState<KnowledgeFragment[]>(mockKnowledgeFragments);

  // 发送消息
  const sendMessage = (content: string, fragmentIds: string[] = [], role: 'user' | 'ai' = 'user') => {
    const newMessage: CopilotMessage = {
      id: uuidv4(),
      content,
      role,
      timestamp: Date.now(),
      fragmentIds,
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  // 清空消息
  const clearMessages = () => {
    setMessages([]);
  };

  // 生成草稿
  const generateDraft = async (prompt: string): Promise<string> => {
    // 模拟AI生成过程
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return `基于提示"${prompt}"生成的草稿内容...`;
  };

  // 搜索知识片段
  const searchKnowledgeFragments = (query: string): KnowledgeFragment[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return knowledgeFragments.filter((fragment) => {
      return (
        fragment.title.toLowerCase().includes(lowerQuery) ||
        fragment.content.toLowerCase().includes(lowerQuery) ||
        fragment.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  };

  return (
    <CopilotContext.Provider
      value={{
        messages,
        sendMessage,
        clearMessages,
        generateDraft,
        knowledgeFragments,
        searchKnowledgeFragments,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};

export const useCopilotContext = () => {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error('useCopilotContext must be used within a CopilotProvider');
  }
  return context;
}; 