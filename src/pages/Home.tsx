import { useState } from 'react';
import { useScriptContext } from '../context/ScriptContext';

export default function Home() {
  // 状态管理
  const { createScript } = useScriptContext();
  const [selectedModel, setSelectedModel] = useState('claude35_sonnet2');
  const [feedbackText, setFeedbackText] = useState('');
  
  // 角色和步骤管理
  const [selectedStep, setSelectedStep] = useState<'outline' | 'characters' | 'relationships' | 'scenes' | 'acts' | 'script'>('script');
  
  // 处理反馈提交
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 处理反馈逻辑
    console.log('提交的反馈:', feedbackText);
    // 提交后清空输入框
    setFeedbackText('');
  };
  
  return (
    <div className="flex h-screen bg-white">
      {/* 左侧边栏 */}
      <aside className="w-64 border-r flex flex-col overflow-auto">
        {/* 菜单头部 */}
        <div className="p-4 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
        </div>
        
        {/* 作品集 */}
        <div className="py-4 px-6 border-b flex justify-between items-center">
          <span className="text-base">作品集</span>
          <button className="text-xl font-light">+</button>
        </div>
        
        {/* 项目列表 */}
        <div className="border-b">
          <div className="py-2 px-6 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <button className="mr-1">›</button>
              <span>《xxxx》</span>
            </div>
            <div className="flex space-x-1">
              <button>↓</button>
              <button>+</button>
            </div>
          </div>
          
          <div className="py-2 px-6 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <button className="mr-1 transform rotate-90">›</button>
              <span>《xxxx》</span>
            </div>
            <div className="flex space-x-1">
              <button>↓</button>
              <button>+</button>
            </div>
          </div>
          
          {/* 角色剧本子节点 */}
          <div className="py-2 px-6 pl-10 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <button className="mr-1 transform rotate-90">›</button>
              <span>角色剧本</span>
            </div>
            <div className="flex space-x-1">
              <button>↓</button>
              <button>+</button>
            </div>
          </div>
          
          {/* 女1角色 */}
          <div className="py-2 px-6 pl-14 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <button className="mr-1 transform rotate-90">›</button>
              <span>女1: xxx</span>
            </div>
            <div className="flex space-x-1">
              <button>↓</button>
              <button>+</button>
            </div>
          </div>
          
          {/* 第一本等 */}
          <div className="py-2 px-6 pl-20 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <button className="mr-1">›</button>
              <span>第一本</span>
            </div>
            <div className="flex space-x-1">
              <button>↓</button>
              <button>+</button>
            </div>
          </div>
          
          <div className="py-2 px-6 pl-20 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <button className="mr-1">›</button>
              <span>第二本</span>
            </div>
            <div className="flex space-x-1">
              <button>↓</button>
              <button>+</button>
            </div>
          </div>
          
          <div className="py-2 px-6 pl-20 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <button className="mr-1">›</button>
              <span>第三本</span>
            </div>
            <div className="flex space-x-1">
              <button>↓</button>
              <button>+</button>
            </div>
          </div>
          
          {/* 女2角色 */}
          <div className="py-2 px-6 pl-14 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <button className="mr-1">›</button>
              <span>女2: xxx</span>
            </div>
            <div className="flex space-x-1">
              <button>↓</button>
              <button>+</button>
            </div>
          </div>
          
          {/* 主持人手册 */}
          <div className="py-2 px-6 pl-14 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <button className="mr-1">›</button>
              <span>主持人手册</span>
            </div>
            <div className="flex space-x-1">
              <button>↓</button>
              <button>+</button>
            </div>
          </div>
          
          {/* 物料 */}
          <div className="py-2 px-6 pl-14 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <button className="mr-1">›</button>
              <span>物料</span>
            </div>
            <div className="flex space-x-1">
              <button>↓</button>
              <button>+</button>
            </div>
          </div>
        </div>
        
        {/* 知识库 */}
        <div className="py-4 px-6 border-b flex justify-between items-center">
          <span className="text-base">知识库</span>
          <button className="text-xl font-light">+</button>
        </div>
        
        {/* 工作流 */}
        <div className="py-4 px-6 border-b flex justify-between items-center">
          <span className="text-base">工作流</span>
          <button className="text-xl font-light">+</button>
        </div>
        
        {/* 底部标识 */}
        <div className="mt-auto p-4 text-gray-400 text-sm">
          Writer.AI @千帆叙梦
        </div>
      </aside>
      
      {/* 中间编辑区 */}
      <div className="flex-1 flex flex-col border-r overflow-auto">
        {/* 步骤导航 */}
        <div className="p-4 flex items-center justify-center space-x-1">
          <button className={`border rounded-md px-4 py-1 ${selectedStep === 'outline' ? 'bg-white' : 'bg-white'}`}>
            大纲
          </button>
          <div className="w-4 h-0 border-t border-gray-300"></div>
          <button className={`border rounded-md px-4 py-1 ${selectedStep === 'characters' ? 'bg-white' : 'bg-white'}`}>
            角色
          </button>
          <div className="w-4 h-0 border-t border-gray-300"></div>
          <button className={`border rounded-md px-4 py-1 ${selectedStep === 'relationships' ? 'bg-white' : 'bg-white'}`}>
            关系
          </button>
          <div className="w-4 h-0 border-t border-gray-300"></div>
          <button className={`border rounded-md px-4 py-1 ${selectedStep === 'scenes' ? 'bg-white' : 'bg-white'}`}>
            章节
          </button>
          <div className="w-4 h-0 border-t border-gray-300"></div>
          <button className={`border rounded-md px-4 py-1 ${selectedStep === 'acts' ? 'bg-white' : 'bg-white'}`}>
            分幕
          </button>
          <div className="w-4 h-0 border-t border-gray-300"></div>
          <button className={`bg-black text-white rounded-md px-4 py-1 ${selectedStep === 'script' ? '' : ''}`}>
            剧本
          </button>
        </div>
        
        {/* 模型和知识库选择 */}
        <div className="px-4 flex space-x-4 mb-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-2">
            <span className="text-xl">ᴀɪ</span>
            <span className="text-sm">{selectedModel}</span>
            <button className="text-xs">▼</button>
          </div>
          
          <div className="bg-white border rounded-md px-3 py-2">
            文风
          </div>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
            <span>知识库: xxxxxx</span>
            <button className="text-xs">▼</button>
          </div>
        </div>
        
        {/* 主要内容区 */}
        <div className="flex-1 flex flex-col px-4 space-y-4 pb-4">
          {/* 角色对话 */}
          <div className="w-full flex justify-end mb-3">
            <div className="relative max-w-[85%]">
              {/* 主要内容区 */}
              <div className="bg-black text-white py-3 px-4 rounded-2xl">
                <span>角色1和角色2在xxx发生了xxx而不是xxx</span>
              </div>
              {/* 右侧气泡尾巴 - 使用伪元素实现 */}
              <style jsx>{`
                .bubble-tail {
                  position: absolute;
                  right: -8px;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 0;
                  height: 0;
                  border-top: 8px solid transparent;
                  border-bottom: 8px solid transparent;
                  border-left: 10px solid black;
                }
              `}</style>
              <div className="bubble-tail"></div>
            </div>
          </div>
          
          {/* 提示信息 */}
          <div className="border rounded-md p-3 text-gray-600">
            <p>根据xxxxxxxx，为您提供以下内容选择：</p>
          </div>
          
          {/* 选项1 */}
          <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
            <p>1. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
          </div>
          
          {/* 选项2 */}
          <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
            <p>2. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
          </div>
          
          {/* 选项3 */}
          <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
            <p>3. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
          </div>
          
          {/* 页面询问 */}
          <div className="border rounded-md p-3 text-gray-600">
            <p>点击替换。这个方向对吗? 还是从xxxxxxxxxx展开?</p>
          </div>
          
          {/* 反馈输入框 - 修改为真正的输入框 */}
          <form onSubmit={handleFeedbackSubmit} className="border rounded-md p-3">
            <input
              type="text"
              placeholder="剧情不好? 告诉我如何优化，如: xxxxxxx"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full focus:outline-none text-gray-700"
            />
          </form>
        </div>
      </div>
      
      {/* 右侧预览区 */}
      <div className="w-1/3 flex flex-col">
        {/* 头部标题 */}
        <div className="p-4 flex justify-between items-center">
          <h2 className="font-medium">第一本-第一幕 <span className="text-gray-400 text-sm">进入角色 ›</span></h2>
          <div className="flex space-x-2">
            <button className="w-6 h-6 border border-dashed rounded"></button>
            <button className="w-6 h-6 border border-dashed rounded"></button>
            <button className="w-6 h-6 border border-dashed rounded"></button>
          </div>
        </div>
        
        {/* 分幕标题 */}
        <div className="mx-4 border rounded-md p-3 flex justify-between items-center mb-4">
          <span>分幕剧情12: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
          <button className="text-blue-500">修改剧情</button>
        </div>
        
        {/* 内容列表 */}
        <div className="px-4 flex-1 overflow-y-auto">
          <ol className="list-decimal pl-5 space-y-6">
            <li className="text-sm">
              <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xx</p>
            </li>
            
            <li className="text-sm">
              <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xx</p>
            </li>
            
            <li className="text-sm">
              <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
            </li>
            
            <li className="text-sm">
              <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxx</p>
            </li>
            
            <li className="text-sm">
              <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
            </li>
            
            <li className="text-sm">
              <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
} 