import { useState, useRef, useEffect } from 'react';
import { useCopilotContext } from '../context/CopilotContext';
import { useScriptContext } from '../context/ScriptContext';
import { KnowledgeFragment, WorkflowStep } from '../types';
import GeminiService from '../services/GeminiService';
import RagService from '../services/RagService';

// 添加全局样式
const addGlobalStyles = () => {
  // 检查是否已添加样式
  if (document.getElementById('copilot-global-styles')) return;
  
  const styleEl = document.createElement('style');
  styleEl.id = 'copilot-global-styles';
  styleEl.innerHTML = `
    .dragging {
      transition: none !important;
      cursor: grabbing !important;
      user-select: none;
    }
    .copilot-drag-handle {
      cursor: grab;
      user-select: none;
    }
    .copilot-drag-handle:active {
      cursor: grabbing;
    }
    @keyframes pulse-border {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
      70% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
    .pulse-on-hover:hover {
      animation: pulse-border 1.5s infinite;
    }
    .copilot-toggle-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background-color: #2563eb;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .copilot-toggle-btn:hover {
      transform: scale(1.05);
      background-color: #1d4ed8;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
    }
    .copilot-container {
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .copilot-container.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .copilot-container.hidden {
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    }
  `;
  document.head.appendChild(styleEl);
};

// 为了确保在控制台日志中显示状态变化
function debugLog(message: string, ...args: any[]): void {
  console.log(`%c[Copilot Debug] ${message}`, 'background: #3b82f6; color: white; padding: 2px 4px; border-radius: 2px;', ...args);
}

export default function Copilot() {
  debugLog('Copilot组件初始化');
  
  const { messages, sendMessage, knowledgeFragments, searchKnowledgeFragments } = useCopilotContext();
  const { currentScript, updateOutline, addCharacter, setWorkflowStep } = useScriptContext();
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFragments, setSelectedFragments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KnowledgeFragment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 引导式创作状态
  const [showGuidedCreation, setShowGuidedCreation] = useState(false);
  const [storyBackground, setStoryBackground] = useState('');
  const [characterSettings, setCharacterSettings] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGenerationStep, setCurrentGenerationStep] = useState<WorkflowStep>('outline');
  const [generationProgress, setGenerationProgress] = useState(0);

  // 拖动相关状态
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const initialPos = useRef({ x: 0, y: 0 });
  const lastFrameRef = useRef(0); // 用于requestAnimationFrame
  const dragStarted = useRef(false); // 跟踪拖动是否开始
  const lastUpdateTime = useRef(0); // 用于控制拖动更新频率
  
  // 控制Copilot的显示状态 - 默认隐藏
  const [isVisible, setIsVisible] = useState(false);

  // Gemini和RAG状态
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiModel, setAiModel] = useState<'rag' | 'gemini'>('rag');

  // 添加全局样式
  useEffect(() => {
    debugLog('添加全局样式');
    addGlobalStyles();
  }, []);

  // 初始化位置
  useEffect(() => {
    debugLog('初始化位置');
    // 默认位置：右侧并且不会完全超出屏幕
    if (!dragStarted.current && typeof window !== 'undefined') {
      const rightPosition = Math.max(window.innerWidth - 400, window.innerWidth / 2);
      setPosition({
        x: rightPosition,
        y: Math.max(window.innerHeight * 0.3, 100)
      });
      dragStarted.current = true;
      debugLog('位置已初始化', { x: rightPosition, y: Math.max(window.innerHeight * 0.3, 100) });
    }
  }, []);

  // 使用requestAnimationFrame更新位置，增强性能，并降低灵敏度
  const updateDragPosition = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    cancelAnimationFrame(lastFrameRef.current);
    
    // 降低更新频率，每50ms更新一次位置
    const now = Date.now();
    if (now - lastUpdateTime.current < 50) return;
    lastUpdateTime.current = now;
    
    lastFrameRef.current = requestAnimationFrame(() => {
      if (!dragRef.current) return;
      
      // 计算新位置
      const dx = clientX - dragStartPos.x;
      const dy = clientY - dragStartPos.y;
      
      // 添加最小移动阈值，小于5px的移动忽略
      const moveThreshold = 5;
      if (Math.abs(dx) < moveThreshold && Math.abs(dy) < moveThreshold) return;
      
      const newX = initialPos.current.x + dx;
      const newY = initialPos.current.y + dy;
      
      // 确保至少25%的组件在屏幕内可见
      const copilotWidth = dragRef.current?.offsetWidth || 380;
      const copilotHeight = dragRef.current?.offsetHeight || 450;
      const minVisibleWidth = copilotWidth * 0.25;
      const minVisibleHeight = copilotHeight * 0.25;
      
      const maxX = window.innerWidth - minVisibleWidth;
      const maxY = window.innerHeight - minVisibleHeight;
      const minX = minVisibleWidth - copilotWidth;
      const minY = minVisibleHeight - copilotHeight;
      
      setPosition({
        x: Math.max(minX, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY))
      });
    });
  };
  
  // 拖动处理函数
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    
    // 只有点击标题栏才能拖动
    if ((e.target as HTMLElement).closest('.copilot-drag-handle')) {
      e.preventDefault();
      // 获取拖动元素的位置信息（暂未使用）
      dragRef.current.getBoundingClientRect();
      initialPos.current = { x: position.x, y: position.y };
      setDragStartPos({ x: e.clientX, y: e.clientY });
      setIsDragging(true);
      lastUpdateTime.current = Date.now(); // 初始化更新时间
      
      // 添加拖动中类名，用于自定义样式
      dragRef.current.classList.add('dragging');
      debugLog('开始拖动');
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    updateDragPosition(e.clientX, e.clientY);
  };
  
  const handleMouseUp = () => {
    if (isDragging && dragRef.current) {
      dragRef.current.classList.remove('dragging');
      setIsDragging(false);
      
      // 添加结束拖动的平滑过渡效果
      if (dragRef.current) {
        dragRef.current.style.transition = 'transform 0.2s ease-out';
        setTimeout(() => {
          if (dragRef.current) {
            dragRef.current.style.transition = '';
          }
        }, 200);
      }
      debugLog('结束拖动');
    }
  };
  
  // 添加全局鼠标事件监听
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleMouseMove(e);
      }
    };
    
    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleMouseUp();
      }
    };
    
    // 添加触摸事件支持
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        e.preventDefault();
        updateDragPosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    
    const handleTouchEnd = () => {
      handleMouseUp();
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(lastFrameRef.current);
    };
  }, [isDragging, dragStartPos]);

  // 处理窗口大小变化，确保copilot不会超出视口
  useEffect(() => {
    const handleResize = () => {
      if (!dragRef.current) return;
      
      const copilotWidth = dragRef.current.offsetWidth;
      const copilotHeight = dragRef.current.offsetHeight;
      const minVisibleWidth = copilotWidth * 0.25;
      const minVisibleHeight = copilotHeight * 0.25;
      
      const maxX = window.innerWidth - minVisibleWidth;
      const maxY = window.innerHeight - minVisibleHeight;
      const minX = minVisibleWidth - copilotWidth;
      const minY = minVisibleHeight - copilotHeight;
      
      setPosition(prev => ({
        x: Math.max(minX, Math.min(prev.x, maxX)),
        y: Math.max(minY, Math.min(prev.y, maxY))
      }));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Search knowledge fragments
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchKnowledgeFragments(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchKnowledgeFragments]);

  // 初始化RAG知识库
  useEffect(() => {
    if (knowledgeFragments.length > 0) {
      RagService.setKnowledgeBase(knowledgeFragments);
    }
  }, [knowledgeFragments]);

  // 处理发送消息
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // 发送用户消息
    sendMessage(inputValue, selectedFragments);
    
    // 准备AI回复
    const userQuery = inputValue;
    setInputValue('');
    setSelectedFragments([]);
    setSearchQuery('');
    
    // 设置AI处理状态
    setIsAiProcessing(true);
    
    try {
      // 根据所选模型生成回复
      let aiResponse: string;
      
      if (selectedFragments.length > 0) {
        // 如果用户选择了知识片段，使用RAG模式
        const selectedDocs = selectedFragments.map(id => 
          knowledgeFragments.find(frag => frag.id === id)
        ).filter(Boolean) as KnowledgeFragment[];
        
        // 设置RAG的知识库为选定的片段
        RagService.setKnowledgeBase(selectedDocs);
        aiResponse = await RagService.answerQuery(userQuery);
      } else if (aiModel === 'rag') {
        // 使用完整知识库的RAG
        aiResponse = await RagService.answerQuery(userQuery);
      } else {
        // 直接使用Gemini
        aiResponse = await GeminiService.generateText(userQuery);
      }
      
      // 发送AI回复
      sendMessage(aiResponse, [], 'ai');
    } catch (error) {
      console.error('生成AI回复时出错:', error);
      sendMessage('抱歉，我现在无法处理您的请求。请稍后再试。', [], 'ai');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const toggleFragmentSelection = (fragmentId: string) => {
    setSelectedFragments(prevSelected => 
      prevSelected.includes(fragmentId)
        ? prevSelected.filter(id => id !== fragmentId)
        : [...prevSelected, fragmentId]
    );
  };

  // 切换Copilot可见性 - 简化逻辑
  const toggleVisibility = () => {
    debugLog('切换可见性，当前状态', isVisible);
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    
    // 如果切换为显示，则确保展开
    if (newVisibility) {
      setIsExpanded(true);
    }
    
    debugLog('切换后状态', newVisibility);
  };

  // Quick prompts
  const quickPrompts = [
    { id: 'character', text: '帮我设计人物', prompt: '请帮我设计一个有深度的角色，包括基本背景、性格特点和动机。' },
    { id: 'conflict', text: '构思冲突', prompt: '我需要在这个场景中设计一个有意思的冲突，主要涉及角色的内心矛盾。' },
    { id: 'plot-twist', text: '剧情转折', prompt: '请帮我构思一个令人惊讶但合理的剧情转折，避免过于俗套。' },
    { id: 'scene', text: '场景描写', prompt: '我需要一个生动的场景描写，强调氛围和细节。' },
    { id: 'guided', text: '引导式创作', prompt: '' },
  ];

  // 模拟AI生成内容的函数
  const simulateAiGeneration = async () => {
    if (!currentScript) return;
    
    setIsGenerating(true);
    
    try {
      // 生成大纲
      setCurrentGenerationStep('outline');
      setGenerationProgress(20);
      
      // 使用Gemini优化大纲
      const outlinePrompt = `创建一个剧本杀游戏大纲，标题为"${currentScript.title}"。
背景设定: ${storyBackground}
请提供完整的世界观、核心矛盾和主要情节。`;
      
      const outline = await GeminiService.generateText(outlinePrompt, 0.7, 2000);
      updateOutline(outline);
      setWorkflowStep('outline');
      await new Promise(r => setTimeout(r, 500)); // 视觉延迟
      
      // 生成角色关系
      setCurrentGenerationStep('relationships');
      setGenerationProgress(40);
      
      // 解析角色设定并使用Gemini完善
      const characterLines = characterSettings.split('\n');
      for (const line of characterLines) {
        if (line.trim()) {
          try {
            const charName = line.split(':')[0]?.trim() || '未命名角色';
            const characterDetails = await GeminiService.createCharacter(line);
            
            addCharacter({
              name: charName,
              description: characterDetails.substring(0, 100) + '...',
              background: characterDetails
            });
            
            await new Promise(r => setTimeout(r, 300)); // 添加间隔
          } catch (error) {
            console.error('创建角色时出错:', error);
          }
        }
      }
      
      setWorkflowStep('relationships');
      await new Promise(r => setTimeout(r, 500)); // 视觉延迟
      
      // 生成场景分幕
      setCurrentGenerationStep('scenes');
      setGenerationProgress(60);
      await new Promise(r => setTimeout(r, 800));
      setWorkflowStep('scenes');
      
      // 生成剧本初稿
      setCurrentGenerationStep('draft');
      setGenerationProgress(90);
      await new Promise(r => setTimeout(r, 800));
      setWorkflowStep('draft');
      
      // 完成所有生成
      setGenerationProgress(100);
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.error('AI生成过程中出错:', error);
      sendMessage('生成过程中发生错误，请稍后重试。', [], 'ai');
    } finally {
      // 重置状态
      setIsGenerating(false);
      setShowGuidedCreation(false);
      
      // 添加AI完成消息
      sendMessage(`我已经根据您提供的故事背景和角色设定完成了初步的剧本框架构建。现在您可以点击各个工作流步骤来查看和编辑内容，我会持续为您提供创作建议和辅助。需要任何帮助，请随时向我提问。`, [], 'ai');
    }
  };

  debugLog('渲染Copilot组件', { isVisible, isExpanded });

  return (
    <>
      {/* 永久性切换按钮 */}
      <div 
        className="copilot-toggle-btn"
        onClick={toggleVisibility}
        title={isVisible ? "隐藏Copilot助手" : "显示Copilot助手"}
        style={{ backgroundColor: isVisible ? '#3b82f6' : '#4f46e5' }}
      >
        <span style={{ fontSize: '28px' }}>🤖</span>
      </div>
      
      {/* Copilot主界面 - 使用CSS类控制动画过渡 */}
      <div 
        ref={dragRef}
        className={`fixed z-50 transform duration-75 will-change-transform copilot-container ${isVisible ? 'visible' : 'hidden'} ${
          isDragging ? 'cursor-grabbing opacity-95 dragging' : 'hover:shadow-xl'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          width: '380px',
          filter: isDragging ? 'brightness(0.98)' : 'none',
          willChange: 'transform',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => {
          if ((e.target as HTMLElement).closest('.copilot-drag-handle')) {
            e.preventDefault();
            const touch = e.touches[0];
            initialPos.current = { x: position.x, y: position.y };
            setDragStartPos({ x: touch.clientX, y: touch.clientY });
            setIsDragging(true);
            lastUpdateTime.current = Date.now(); // 初始化更新时间
            
            if (dragRef.current) {
              dragRef.current.classList.add('dragging');
            }
          }
        }}
      >
        <div 
          className={`relative overflow-hidden rounded-lg transition-all duration-300 ease-in-out ${isExpanded ? 'h-[520px]' : 'h-12'} 
          bg-white border border-gray-200 shadow-lg ${!isDragging ? 'hover:border-blue-300' : ''}`}
        >
          {/* Header */}
          <div 
            className="bg-blue-600 text-white p-3 flex justify-between items-center copilot-drag-handle select-none"
            onClick={() => {
              // 确保只有当它不是拖动结束时才切换展开状态
              if (!isDragging) {
                setIsExpanded(!isExpanded);
              }
            }}
          >
            <div className="flex items-center">
              <span className="mr-2 text-xl">🤖</span>
              <h3 className="font-semibold text-white">
                {isExpanded ? "Copilot 创作助手" : "Copilot 创作助手 - 点击展开"}
              </h3>
            </div>
            <div className="flex items-center">
              {isExpanded && (
                <span className="text-xs mr-3 bg-blue-700 px-2 py-1 rounded flex items-center">
                  <span className="mr-1">✋</span> 
                  可拖动
                </span>
              )}
              <span className="transition-transform duration-300" style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>▼</span>
            </div>
          </div>

          {isExpanded && (
            <>
              {showGuidedCreation ? (
                <div className="p-3 overflow-y-auto h-full bg-gray-50">
                  <div className="mb-3 flex justify-between items-center">
                    <h4 className="font-medium text-gray-800">引导式创作</h4>
                    <button 
                      onClick={() => setShowGuidedCreation(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      返回
                    </button>
                  </div>
                  
                  {isGenerating ? (
                    <div className="text-center py-6">
                      <p className="mb-3 font-medium">{
                        currentGenerationStep === 'outline' ? '正在生成剧本大纲...' :
                        currentGenerationStep === 'characters' ? '正在设计角色...' :
                        currentGenerationStep === 'relationships' ? '正在构建角色关系...' :
                        currentGenerationStep === 'scenes' ? '正在分配场景...' :
                        '正在完成剧本初稿...'
                      }</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${generationProgress}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-500">AI正在处理您的输入，请稍候...</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          故事背景
                        </label>
                        <textarea
                          value={storyBackground}
                          onChange={(e) => setStoryBackground(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                          rows={3}
                          placeholder="描述故事的时代、地点、社会背景等信息..."
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          角色设定 & 角色关系
                        </label>
                        <textarea
                          value={characterSettings}
                          onChange={(e) => setCharacterSettings(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                          rows={4}
                          placeholder="角色1: 描述角色1的身份和特点&#10;角色2: 描述角色2的身份和特点&#10;角色1与角色2的关系: 描述他们之间的关系"
                        />
                      </div>
                      
                      <button
                        onClick={simulateAiGeneration}
                        disabled={!storyBackground.trim() || !characterSettings.trim() || !currentScript}
                        className={`w-full py-2 rounded-md font-medium transition-all duration-200 ${
                          !storyBackground.trim() || !characterSettings.trim() || !currentScript
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                        }`}
                      >
                        开始AI引导式创作
                      </button>
                      
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        AI将按照剧本创作流程，依次生成大纲、角色、场景和初稿
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col h-[calc(100%-48px)]">
                  {/* Messages area - 减少高度给其他组件留出空间 */}
                  <div className="h-52 overflow-y-auto p-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {messages.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <p>你好，我是你的剧本创作助手！</p>
                        <p className="text-sm mt-2">我使用Gemini AI提供支持，有什么可以帮助你的？</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`mb-3 ${message.role === 'user' ? 'text-right' : ''}`}
                        >
                          <div 
                            className={`inline-block px-3 py-2 rounded-lg max-w-[80%] shadow-sm ${
                              message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                          >
                            {message.content}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))
                    )}
                    {isAiProcessing && (
                      <div className="text-left mb-3">
                        <div className="inline-block px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-sm text-gray-600">思考中...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* 模型选择 - 保持紧凑 */}
                  <div className="px-2 py-1 border-t flex justify-center">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">模型:</span>
                      <button 
                        className={`px-2 py-1 rounded-md transition-colors ${
                          aiModel === 'rag' 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setAiModel('rag')}
                      >
                        RAG知识库
                      </button>
                      <button 
                        className={`px-2 py-1 rounded-md transition-colors ${
                          aiModel === 'gemini' 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setAiModel('gemini')}
                      >
                        Gemini
                      </button>
                    </div>
                  </div>

                  {/* Quick prompts - 高度保持紧凑 */}
                  <div className="p-1 border-t border-b flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt.id}
                        onClick={() => {
                          if (prompt.id === 'guided') {
                            setShowGuidedCreation(true);
                          } else {
                            setInputValue(prompt.prompt);
                          }
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 whitespace-nowrap transition-all duration-200 hover:shadow-sm"
                      >
                        {prompt.text}
                      </button>
                    ))}
                  </div>

                  {/* Knowledge fragment search - 减小搜索区域高度 */}
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="搜索灵感碎片..."
                    />
                    
                    {searchResults.length > 0 && (
                      <div className="mt-1 max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                        {searchResults.map((fragment) => (
                          <div 
                            key={fragment.id}
                            className={`p-2 text-xs rounded cursor-pointer mb-1 transition-all duration-200 ${
                              selectedFragments.includes(fragment.id)
                                ? 'bg-blue-100 border border-blue-300'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={() => toggleFragmentSelection(fragment.id)}
                          >
                            <div className="font-medium">{fragment.title}</div>
                            <div className="truncate">{fragment.content}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input area - 确保始终可见 */}
                  <div className="mt-auto p-2 flex items-center bg-white">
                    <form onSubmit={handleSendMessage} className="w-full flex items-center">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="w-full px-4 py-2 pr-12 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-50 placeholder-gray-400 pulse-on-hover"
                          placeholder="输入你的问题或要求..."
                          disabled={isAiProcessing}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-400">🔍</span>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-200 hover:shadow-md flex items-center justify-center"
                        disabled={!inputValue.trim() || isAiProcessing}
                      >
                        <span>{isAiProcessing ? '处理中' : '发送'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}