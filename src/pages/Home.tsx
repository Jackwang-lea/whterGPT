import { useState } from 'react';
import { useScriptContext } from '../context/ScriptContext';
import { Icon } from '@iconify/react';
import ActsView from '../components/ActsView';
import ScriptView from '../components/ScriptView';

export default function Home() {
  // 状态管理
  const { createScript } = useScriptContext();
  const [selectedModel, setSelectedModel] = useState('claude35_sonnet2');
  const [feedbackText, setFeedbackText] = useState('');
  
  // 角色和步骤管理
  const [selectedStep, setSelectedStep] = useState<'outline' | 'characters' | 'relationships' | 'scenes' | 'acts' | 'script'>('script');
  
  // 角色视图与剧情视图切换
  const [showCharactersView, setShowCharactersView] = useState(true);
  
  // 添加侧边栏折叠状态
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // 添加作品集折叠状态
  const [portfolioCollapsed, setPortfolioCollapsed] = useState(false);
  const [knowledgeCollapsed, setKnowledgeCollapsed] = useState(false);
  const [workflowCollapsed, setWorkflowCollapsed] = useState(false);
  
  // 右侧编辑器状态
  const [isEditing, setIsEditing] = useState(false);
  const [plotTitle, setPlotTitle] = useState('分幕剧情12: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  const [editPlotTitle, setEditPlotTitle] = useState('');
  const [plotContent, setPlotContent] = useState([
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xx',
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xx',
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxx',
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  ]);
  const [editPlotContent, setEditPlotContent] = useState<string[]>([]);
  
  // 处理反馈提交
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 处理反馈逻辑
    console.log('提交的反馈:', feedbackText);
    // 提交后清空输入框
    setFeedbackText('');
  };
  
  // 切换侧边栏状态
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // 切换作品集折叠状态
  const togglePortfolio = () => {
    setPortfolioCollapsed(!portfolioCollapsed);
  };
  
  // 切换知识库折叠状态
  const toggleKnowledge = () => {
    setKnowledgeCollapsed(!knowledgeCollapsed);
  };
  
  // 切换工作流折叠状态
  const toggleWorkflow = () => {
    setWorkflowCollapsed(!workflowCollapsed);
  };
  
  // 开始编辑剧情
  const startEditing = () => {
    setEditPlotTitle(plotTitle);
    setEditPlotContent([...plotContent]);
    setIsEditing(true);
  };
  
  // 取消编辑
  const cancelEditing = () => {
    setIsEditing(false);
  };
  
  // 保存编辑
  const saveEditing = () => {
    setPlotTitle(editPlotTitle);
    setPlotContent([...editPlotContent]);
    setIsEditing(false);
  };
  
  // 更新特定段落的内容
  const updateParagraph = (index: number, content: string) => {
    const newContent = [...editPlotContent];
    newContent[index] = content;
    setEditPlotContent(newContent);
  };
  
  return (
    <div className="flex h-screen bg-white">
      {/* 热区 - 当侧边栏折叠时显示 */}
      {sidebarCollapsed && (
        <div 
          className="fixed left-0 top-0 w-4 h-full z-20"
          onMouseEnter={() => setSidebarCollapsed(false)}
        />
      )}
      
      {/* 侧边栏折叠按钮 */}
      <div 
        className={`fixed top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 ${
          sidebarCollapsed ? 'left-0' : 'left-64'
        }`}
      >
        <button 
          onClick={toggleSidebar}
          className="bg-white border border-gray-200 rounded-r-md h-20 w-6 shadow-md hover:bg-gray-50 flex items-center justify-center transition-all duration-200 hover:text-blue-600"
          title={sidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          <Icon 
            icon={sidebarCollapsed ? "lucide:chevron-right" : "lucide:chevron-left"} 
            width="16" 
            height="16" 
            className="text-gray-600" 
          />
        </button>
      </div>
      
      {/* 左侧边栏 - 添加展开/折叠逻辑 */}
      <aside 
        className={`border-r border-gray-200 flex flex-col overflow-auto transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-64 opacity-100'
        }`}
        onMouseEnter={() => sidebarCollapsed && setSidebarCollapsed(false)}
      >
        {/* 菜单头部 */}
        <div className="p-4 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
        </div>
        
        {/* 作品集 */}
        <div 
          className="py-4 px-6 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
          onClick={togglePortfolio}
        >
          <div className="flex items-center">
            <Icon 
              icon={portfolioCollapsed ? "lucide:chevron-right" : "lucide:chevron-down"} 
              width="20" 
              height="20" 
              className="mr-2 text-gray-500"
            />
            <span className="text-base font-medium">作品集</span>
          </div>
          <button className="text-xl font-light" onClick={(e) => e.stopPropagation()}>
            <Icon icon="lucide:plus" width="20" height="20" inline={true} />
          </button>
        </div>
        
        {/* 项目列表 - 根据折叠状态显示或隐藏 */}
        {!portfolioCollapsed && (
          <div className="border-b border-gray-200">
            <div className="py-2 px-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <button className="mr-1">
                  <Icon icon="lucide:chevron-right" width="20" height="20" inline={true} />
                </button>
                <span>《xxxx》</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:download" width="18" height="18" inline={true} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:plus" width="18" height="18" inline={true} />
                </button>
              </div>
            </div>
            
            <div className="py-2 px-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <button className="mr-1">
                  <Icon icon="lucide:chevron-down" width="20" height="20" inline={true} />
                </button>
                <span>《xxxx》</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:download" width="18" height="18" inline={true} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:plus" width="18" height="18" inline={true} />
                </button>
              </div>
            </div>
            
            {/* 角色剧本子节点 */}
            <div className="py-2 px-6 pl-10 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <button className="mr-1">
                  <Icon icon="lucide:chevron-down" width="20" height="20" inline={true} />
                </button>
                <span className="font-medium">角色剧本</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:download" width="18" height="18" inline={true} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:plus" width="18" height="18" inline={true} />
                </button>
              </div>
            </div>
            
            {/* 女1角色 */}
            <div className="py-2 px-6 pl-14 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <button className="mr-1">
                  <Icon icon="lucide:chevron-down" width="20" height="20" inline={true} />
                </button>
                <span>女1: xxx</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:download" width="18" height="18" inline={true} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:plus" width="18" height="18" inline={true} />
                </button>
              </div>
            </div>
            
            {/* 第一本等 */}
            <div className="py-2 px-6 pl-20 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <button className="mr-1">
                  <Icon icon="lucide:chevron-right" width="20" height="20" inline={true} />
                </button>
                <span>第一本</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:download" width="18" height="18" inline={true} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:plus" width="18" height="18" inline={true} />
                </button>
              </div>
            </div>
            
            <div className="py-2 px-6 pl-20 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <button className="mr-1">
                  <Icon icon="lucide:chevron-right" width="20" height="20" inline={true} />
                </button>
                <span>第二本</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:download" width="18" height="18" inline={true} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:plus" width="18" height="18" inline={true} />
                </button>
              </div>
            </div>
            
            <div className="py-2 px-6 pl-20 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <button className="mr-1">
                  <Icon icon="lucide:chevron-right" width="20" height="20" inline={true} />
                </button>
                <span>第三本</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:download" width="18" height="18" inline={true} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:plus" width="18" height="18" inline={true} />
                </button>
              </div>
            </div>
            
            {/* 女2角色 */}
            <div className="py-2 px-6 pl-14 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <button className="mr-1">
                  <Icon icon="lucide:chevron-right" width="20" height="20" inline={true} />
                </button>
                <span>女2: xxx</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:download" width="18" height="18" inline={true} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:plus" width="18" height="18" inline={true} />
                </button>
              </div>
            </div>
            
            {/* 主持人手册 */}
            <div className="py-2 px-6 pl-14 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <button className="mr-1">
                  <Icon icon="lucide:chevron-right" width="20" height="20" inline={true} />
                </button>
                <span>主持人手册</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:download" width="18" height="18" inline={true} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:plus" width="18" height="18" inline={true} />
                </button>
              </div>
            </div>
            
            {/* 物料 */}
            <div className="py-2 px-6 pl-14 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <button className="mr-1">
                  <Icon icon="lucide:chevron-right" width="20" height="20" inline={true} />
                </button>
                <span>物料</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:download" width="18" height="18" inline={true} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Icon icon="lucide:plus" width="18" height="18" inline={true} />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 知识库 */}
        <div 
          className="py-4 px-6 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
          onClick={toggleKnowledge}
        >
          <div className="flex items-center">
            <Icon 
              icon={knowledgeCollapsed ? "lucide:chevron-right" : "lucide:chevron-down"} 
              width="20" 
              height="20" 
              className="mr-2 text-gray-500"
            />
            <span className="text-base font-medium">知识库</span>
          </div>
          <button className="text-xl font-light" onClick={(e) => e.stopPropagation()}>
            <Icon icon="lucide:plus" width="20" height="20" inline={true} />
          </button>
        </div>
        
        {/* 知识库内容（可以在这里添加） */}
        {!knowledgeCollapsed && (
          <div className="border-b border-gray-200 py-2 px-6 text-gray-500 text-sm">
            暂无知识库内容
          </div>
        )}
        
        {/* 工作流 */}
        <div 
          className="py-4 px-6 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
          onClick={toggleWorkflow}
        >
          <div className="flex items-center">
            <Icon 
              icon={workflowCollapsed ? "lucide:chevron-right" : "lucide:chevron-down"} 
              width="20" 
              height="20" 
              className="mr-2 text-gray-500"
            />
            <span className="text-base font-medium">工作流</span>
          </div>
          <button className="text-xl font-light" onClick={(e) => e.stopPropagation()}>
            <Icon icon="lucide:plus" width="20" height="20" inline={true} />
          </button>
        </div>
        
        {/* 工作流内容（可以在这里添加） */}
        {!workflowCollapsed && (
          <div className="border-b border-gray-200 py-2 px-6 text-gray-500 text-sm">
            暂无工作流内容
          </div>
        )}
        
        {/* 底部标识 */}
        <div className="mt-auto p-4 text-gray-400 text-sm">
          
        </div>
      </aside>
      
      {/* 中间编辑区 - 根据侧边栏状态调整宽度 */}
      <div 
        className={`flex flex-col border-r border-gray-200 overflow-auto transition-all duration-300 ease-in-out ${
          selectedStep === 'acts' ? 'flex-1' : 'flex-1'
        } ${sidebarCollapsed ? 'ml-0' : 'ml-0'}`}
        style={{width: sidebarCollapsed ? 'calc(100% - 45%)' : 'calc(100% - 45% - 16rem)'}}
      >
        {/* 步骤导航 */}
        <div className="p-4 pt-16 flex items-center justify-center">
          <div className="flex items-center">
            <button 
              className={`px-6 py-2 border ${selectedStep === 'outline' ? 'bg-black text-white border-black' : 'bg-white border-gray-300'} rounded-md`}
              onClick={() => setSelectedStep('outline')}
            >
              大纲
            </button>
            <div className="w-5 h-[1px] bg-gray-300"></div>
            <button 
              className={`px-6 py-2 border ${selectedStep === 'characters' ? 'bg-black text-white border-black' : 'bg-white border-gray-300'} rounded-md`}
              onClick={() => setSelectedStep('characters')}
            >
              角色
            </button>
            <div className="w-5 h-[1px] bg-gray-300"></div>
            <button 
              className={`px-6 py-2 border ${selectedStep === 'relationships' ? 'bg-black text-white border-black' : 'bg-white border-gray-300'} rounded-md`}
              onClick={() => setSelectedStep('relationships')}
            >
              关系
            </button>
            <div className="w-5 h-[1px] bg-gray-300"></div>
            <button 
              className={`px-6 py-2 border ${selectedStep === 'scenes' ? 'bg-black text-white border-black' : 'bg-white border-gray-300'} rounded-md`}
              onClick={() => setSelectedStep('scenes')}
            >
              章节
            </button>
            <div className="w-5 h-[1px] bg-gray-300"></div>
            <button 
              className={`px-6 py-2 border ${selectedStep === 'acts' ? 'bg-black text-white border-black' : 'bg-white border-gray-300'} rounded-md`}
              onClick={() => setSelectedStep('acts')}
            >
              分幕
            </button>
            <div className="w-5 h-[1px] bg-gray-300"></div>
            <button 
              className={`px-6 py-2 border ${selectedStep === 'script' ? 'bg-black text-white border-black' : 'bg-white border-gray-300'} rounded-md`}
              onClick={() => setSelectedStep('script')}
            >
              剧本
            </button>
          </div>
          
          {/* 虚线框按钮组 - 移到导航栏右侧 */}
          <div className="flex space-x-2">
          </div>
        </div>
        
        {selectedStep === 'acts' ? (
          <ActsView 
            feedbackText={feedbackText}
            handleFeedbackSubmit={handleFeedbackSubmit}
            setFeedbackText={setFeedbackText}
          />
        ) : selectedStep === 'script' ? (
          <ScriptView
            selectedModel={selectedModel}
            feedbackText={feedbackText}
            handleFeedbackSubmit={handleFeedbackSubmit}
            setFeedbackText={setFeedbackText}
          />
        ) : (
          // 其他页面的占位符
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl text-gray-500">{selectedStep.charAt(0).toUpperCase() + selectedStep.slice(1)} 页面正在开发中...</p>
          </div>
        )}
      </div>
      
      {/* 右侧预览区 - 仅在非分幕视图下显示 */}
      {selectedStep !== 'acts' && (
        <div className="w-2/5 flex flex-col transition-all duration-300 ease-in-out min-w-[480px] border-l border-gray-200">
          {/* 头部标题 */}
          <div className="p-4 flex justify-between items-center border-b border-gray-200 bg-white">
            <h2 className="font-medium">第一本-第一幕 <span className="text-gray-400 text-sm">进入润色 ›</span></h2>
            <div className="flex space-x-2">
              <button className="w-6 h-6 border-2 border-dashed rounded-sm border-gray-400"></button>
              <button className="w-6 h-6 border-2 border-dashed rounded-sm border-gray-400"></button>
              <button className="w-6 h-6 border-2 border-dashed rounded-sm border-gray-400"></button>
            </div>
          </div>
          
          {/* 分幕标题 */}
          <div className="mx-6 my-5 border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white shadow-sm">
            {isEditing ? (
              <input 
                type="text" 
                value={editPlotTitle}
                onChange={(e) => setEditPlotTitle(e.target.value)}
                className="flex-1 mr-2 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            ) : (
              <span className="text-base">{plotTitle}</span>
            )}
            {isEditing ? (
              <div className="flex space-x-2">
                <button 
                  className="text-gray-500 flex items-center hover:text-gray-700"
                  onClick={cancelEditing}
                >
                  <Icon icon="lucide:x" width="18" height="18" inline={true} className="mr-1" />
                  取消
                </button>
                <button 
                  className="text-green-500 flex items-center hover:text-green-700"
                  onClick={saveEditing}
                >
                  <Icon icon="lucide:check" width="18" height="18" inline={true} className="mr-1" />
                  保存
                </button>
              </div>
            ) : (
              <button 
                className="text-blue-500 flex items-center hover:text-blue-700"
                onClick={startEditing}
              >
                <Icon icon="lucide:edit" width="18" height="18" inline={true} className="mr-1" />
                修改剧情
              </button>
            )}
          </div>
          
          {/* 内容列表 */}
          <div className="px-6 pb-6 flex-1 overflow-y-auto">
            {isEditing ? (
              // 编辑模式
              <div className="space-y-4">
                {editPlotContent.map((paragraph, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="mt-2 text-gray-600 font-medium text-base">{index + 1}.</div>
                    <textarea
                      value={paragraph}
                      onChange={(e) => updateParagraph(index, e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                ))}
                <div className="flex justify-end space-x-2 mt-4">
                  <button 
                    className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    onClick={cancelEditing}
                  >
                    取消
                  </button>
                  <button 
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={saveEditing}
                  >
                    保存更改
                  </button>
                </div>
              </div>
            ) : (
              // 预览模式
              <ol className="list-decimal pl-8 space-y-8">
                {plotContent.map((paragraph, index) => (
                  <li key={index} className="text-base">
                    <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 