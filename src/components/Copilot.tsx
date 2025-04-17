import { useState, useRef, useEffect } from 'react';
import { useCopilotContext } from '../context/CopilotContext';
import { useScriptContext } from '../context/ScriptContext';
import { KnowledgeFragment, WorkflowStep } from '../types';

export default function Copilot() {
  const { messages, sendMessage, generateDraft, knowledgeFragments, searchKnowledgeFragments } = useCopilotContext();
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue, selectedFragments);
      setInputValue('');
      setSelectedFragments([]);
      setSearchQuery('');
    }
  };

  const toggleFragmentSelection = (fragmentId: string) => {
    setSelectedFragments(prevSelected => 
      prevSelected.includes(fragmentId)
        ? prevSelected.filter(id => id !== fragmentId)
        : [...prevSelected, fragmentId]
    );
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
    
    // 生成大纲
    setCurrentGenerationStep('outline');
    setGenerationProgress(20);
    await new Promise(r => setTimeout(r, 1500));
    const outline = `# ${currentScript.title}\n\n## 故事背景\n${storyBackground}\n\n## 核心冲突\n根据角色背景衍生的核心冲突与矛盾`;
    updateOutline(outline);
    setWorkflowStep('outline');
    
    // 生成角色关系
    setCurrentGenerationStep('relationships');
    setGenerationProgress(40);
    await new Promise(r => setTimeout(r, 1500));
    
    // 模拟添加角色
    const characterLines = characterSettings.split('\n');
    for (const line of characterLines) {
      if (line.trim()) {
        const charName = line.split(':')[0]?.trim() || '未命名角色';
        addCharacter({
          name: charName,
          description: line,
          background: `${charName}的背景故事`
        });
      }
    }
    setWorkflowStep('relationships');
    
    // 生成场景分幕
    setCurrentGenerationStep('scenes');
    setGenerationProgress(60);
    await new Promise(r => setTimeout(r, 1500));
    setWorkflowStep('scenes');
    
    // 生成剧本初稿
    setCurrentGenerationStep('draft');
    setGenerationProgress(90);
    await new Promise(r => setTimeout(r, 1500));
    setWorkflowStep('draft');
    
    // 完成所有生成
    setGenerationProgress(100);
    await new Promise(r => setTimeout(r, 500));
    
    // 重置状态
    setIsGenerating(false);
    setShowGuidedCreation(false);
    
    // 添加AI消息
    sendMessage(`我已经根据您提供的故事背景和角色设定完成了初步的剧本框架构建。现在您可以点击各个工作流步骤来查看和编辑内容，我会持续为您提供创作建议和辅助。需要任何帮助，请随时向我提问。`);
  };

  return (
    <div className={`fixed top-1/4 right-4 w-96 bg-white shadow-lg rounded-lg transition-all duration-300 z-50 ${isExpanded ? 'h-96' : 'h-12'}`}>
      {/* Header */}
      <div 
        className="bg-blue-600 text-white p-3 rounded-t flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold">{isExpanded ? "Copilot 创作助手" : "Copilot 创作助手 - 点击展开"}</h3>
        <span>{isExpanded ? '▼' : '▲'}</span>
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
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${generationProgress}%` }}></div>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="角色1: 描述角色1的身份和特点&#10;角色2: 描述角色2的身份和特点&#10;角色1与角色2的关系: 描述他们之间的关系"
                    />
                  </div>
                  
                  <button
                    onClick={simulateAiGeneration}
                    disabled={!storyBackground.trim() || !characterSettings.trim() || !currentScript}
                    className={`w-full py-2 rounded-md font-medium ${
                      !storyBackground.trim() || !characterSettings.trim() || !currentScript
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
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
            <>
              {/* Messages area */}
              <div className="h-52 overflow-y-auto p-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p>你好，我是你的剧本创作助手！</p>
                    <p className="text-sm mt-2">有什么可以帮助你的？</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`mb-3 ${message.role === 'user' ? 'text-right' : ''}`}
                    >
                      <div 
                        className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-800'
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
                <div ref={messagesEndRef} />
              </div>

              {/* Quick prompts */}
              <div className="p-2 border-t border-b flex gap-2 overflow-x-auto">
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
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 whitespace-nowrap"
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>

              {/* Knowledge fragment search */}
              <div className="p-2 border-b">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1 text-sm border rounded-md"
                  placeholder="搜索灵感碎片..."
                />
                
                {searchResults.length > 0 && (
                  <div className="mt-2 max-h-20 overflow-y-auto">
                    {searchResults.map((fragment) => (
                      <div 
                        key={fragment.id}
                        className={`p-2 text-xs rounded cursor-pointer mb-1 ${
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

              {/* Input area */}
              <form onSubmit={handleSendMessage} className="p-2 flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="输入你的问题或要求..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={!inputValue.trim()}
                >
                  发送
                </button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}