import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';

interface ScriptViewProps {
  selectedModel: string;
  feedbackText: string;
  handleFeedbackSubmit: (e: React.FormEvent) => void;
  setFeedbackText: (text: string) => void;
}

export default function ScriptView({ 
  selectedModel: initialModel, 
  feedbackText, 
  handleFeedbackSubmit, 
  setFeedbackText 
}: ScriptViewProps) {
  // 设置向左拉动的偏移量，负值代表向左拉出
  const [offsetX, setOffsetX] = useState(0);
  const [startX, setStartX] = useState(0);
  const isDraggingRef = useRef(false);
  const [width, setWidth] = useState(0);
  
  // 添加状态来管理下拉菜单
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState('通用知识库');
  
  // 控制下拉菜单显示状态
  const [modelDropdownVisible, setModelDropdownVisible] = useState(false);
  const [knowledgeDropdownVisible, setKnowledgeDropdownVisible] = useState(false);
  
  // 模型选项列表
  const modelOptions = [
    'claude35_sonnet2',
    'gpt-4o',
    'gemini-1.5-pro',
    'qwen-max',
    'GLM-4'
  ];
  
  // 知识库选项列表
  const knowledgeBaseOptions = [
    '通用知识库',
    '剧本知识库',
    '历史知识库',
    '科技知识库',
    '文学知识库',
    '自定义知识库'
  ];
  
  // 关闭所有下拉菜单的函数
  const closeAllDropdowns = () => {
    setModelDropdownVisible(false);
    setKnowledgeDropdownVisible(false);
  };
  
  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = () => {
      closeAllDropdowns();
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 处理大小调整
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    setStartX(e.clientX);
    
    const handleResizeMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const diff = startX - e.clientX;
      // 限制最大偏移量为-300px，最小为0
      setOffsetX(Math.max(Math.min(0, -diff), -300));
    };
    
    const handleResizeEnd = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* 左侧调整手柄 */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-2 bg-transparent cursor-ew-resize z-20"
        onMouseDown={handleResizeStart}
        style={{
          width: '10px'
        }}
      >
        <div className="h-full w-1 bg-gray-300 absolute left-0 opacity-0 hover:opacity-50"></div>
      </div>
      
      {/* 主内容区域 - 可向左拉动 */}
      <div 
        className="flex-grow flex flex-col h-full"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDraggingRef.current ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* 模型和知识库选择 */}
        <div className="px-4 flex justify-center items-center space-x-4 mb-4 flex-shrink-0">
          {/* 模型选择下拉菜单 */}
          <div className="relative">
            <div 
              className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-2 border border-gray-200 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setModelDropdownVisible(!modelDropdownVisible);
                setKnowledgeDropdownVisible(false);
              }}
            >
              <Icon icon="lucide:sparkles" width="24" height="24" inline={true} className="text-gray-700" />
              <span className="text-sm">{selectedModel}</span>
              <Icon 
                icon={modelDropdownVisible ? "lucide:chevron-up" : "lucide:chevron-down"} 
                width="16" 
                height="16" 
                inline={true} 
                className="text-gray-500" 
              />
            </div>
            
            {/* 模型下拉列表 */}
            {modelDropdownVisible && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-30">
                {modelOptions.map((model, index) => (
                  <div 
                    key={index}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedModel === model ? 'bg-blue-50 text-blue-600' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedModel(model);
                      setModelDropdownVisible(false);
                    }}
                  >
                    <span className="text-sm">{model}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white px-3 py-2 text-gray-700">
            文风
          </div>
          
          {/* 知识库选择下拉菜单 */}
          <div className="relative">
            <div 
              className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-2 border border-gray-200 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setKnowledgeDropdownVisible(!knowledgeDropdownVisible);
                setModelDropdownVisible(false);
              }}
            >
              <Icon icon="lucide:database" width="18" height="18" inline={true} className="text-gray-700 mr-1" /> 
              <span className="text-sm">知识库: {selectedKnowledgeBase}</span>
              <Icon 
                icon={knowledgeDropdownVisible ? "lucide:chevron-up" : "lucide:chevron-down"} 
                width="16" 
                height="16" 
                inline={true} 
                className="text-gray-500" 
              />
            </div>
            
            {/* 知识库下拉列表 */}
            {knowledgeDropdownVisible && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-30">
                {knowledgeBaseOptions.map((kb, index) => (
                  <div 
                    key={index}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedKnowledgeBase === kb ? 'bg-blue-50 text-blue-600' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedKnowledgeBase(kb);
                      setKnowledgeDropdownVisible(false);
                    }}
                  >
                    <span className="text-sm">{kb}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 主要内容区 - 使用flex布局并设置为自动填充可用空间 */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col h-full">
          {/* 角色对话气泡 */}
          <div className="w-full flex justify-end mb-6">
            <div className="relative max-w-[85%]">
              {/* 主要内容区 */}
              <div className="bg-black text-white py-3 px-4 rounded-xl">
                <span>角色1和角色2在xxx发生了xxx而不是xxx</span>
              </div>
              {/* 右侧气泡尾巴 */}
              <div 
                className="absolute right-[-8px] top-1/2 -translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderLeft: '10px solid black'
                }}
              ></div>
            </div>
          </div>
          
          {/* 滚动内容容器 */}
          <div className="space-y-4">
            {/* 提示信息 */}
            <div className="border border-gray-200 rounded-2xl p-4 text-gray-600 max-w-xl mx-auto bg-white shadow-sm min-h-[60px]">
              <p className="text-sm break-words">根据xxxxxxxx，为您提供以下内容选择：</p>
            </div>
            
            {/* 选择框 - 多个对齐排列 */}
            <div className="max-w-xl mx-auto space-y-2">
              <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow hover:shadow transition-shadow duration-200">
                <p className="text-sm break-words">1. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
              </div>
              
              <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow hover:shadow transition-shadow duration-200">
                <p className="text-sm break-words">2. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
              </div>
              
              <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow hover:shadow transition-shadow duration-200">
                <p className="text-sm break-words">3. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
              </div>
              
              {/* 点击替换提示 */}
              <div className="border border-gray-200 rounded-2xl p-4 text-gray-600 bg-white shadow-sm hover:shadow transition-shadow duration-200">
                <p className="text-gray-700 text-sm break-words">点击替换。这个方向对吗? 还是从xxxxxxxxxx展开?</p>
              </div>
            </div>
            
            {/* 反馈输入框 - 放置在底部，不留太多空隙 */}
            <div className="max-w-xl mx-auto mt-auto sticky bottom-2">
              <form onSubmit={handleFeedbackSubmit} className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm hover:shadow transition-shadow duration-200">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="剧情不好? 告诉我如何优化，如: xxxxxx"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full focus:outline-none text-gray-700 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleFeedbackSubmit(e);
                      }
                    }}
                  />
                  <Icon icon="lucide:send" width="18" height="18" inline={true} className="text-gray-500 hover:text-gray-700 flex-shrink-0 cursor-pointer" onClick={handleFeedbackSubmit} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 