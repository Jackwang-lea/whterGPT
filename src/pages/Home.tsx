import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScriptContext } from '../context/ScriptContext';

export default function Home() {
  const { createScript, selectScript } = useScriptContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreateScript = () => {
    if (!newTitle.trim()) return;
    
    // 创建新剧本并直接跳转
    createScript(newTitle, '');
    // 获取最新创建的剧本ID
    setTimeout(() => {
      const scriptId = localStorage.getItem('currentScriptId');
      if (scriptId) {
        navigate(`/editor/${scriptId}`);
      }
    }, 100);
  };

  const handleGenerate = () => {
    // 创建自动生成的剧本
    createScript('自动生成的剧本', '由AI自动生成的剧本内容');
    // 获取最新创建的剧本ID
    setTimeout(() => {
      const scriptId = localStorage.getItem('currentScriptId');
      if (scriptId) {
        navigate(`/editor/${scriptId}`);
      }
    }, 100);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* 左侧边栏 */}
      <aside className="w-64 flex flex-col">
        {/* 菜单 */}
        <nav className="flex-1">
          <div className="py-4 px-6 border-b flex justify-between items-center">
            <span className="text-base">作品集</span>
            <button className="text-xl font-light">+</button>
          </div>
          <div className="py-4 px-6 border-b flex justify-between items-center">
            <span className="text-base">知识库</span>
            <button className="text-xl font-light">+</button>
          </div>
          <div className="py-4 px-6 border-b flex justify-between items-center">
            <span className="text-base">工作流</span>
            <button className="text-xl font-light">+</button>
          </div>
        </nav>
        
        {/* 底部标识 */}
        <div className="p-4 text-gray-400 text-sm">
          Writer.AI @千帆叙梦
        </div>
      </aside>
      
      {/* 主内容区 */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl mb-16">Hello, 选择一个方式，开始您的创作吧</h1>
        
        {/* 工作流步骤 */}
        <div className="flex gap-2 mb-16">
          <button className="border rounded-md px-4 py-1">大纲</button>
          <button className="border rounded-md px-4 py-1">角色</button>
          <button className="border rounded-md px-4 py-1">关系</button>
          <button className="border rounded-md px-4 py-1">章节</button>
          <button className="border rounded-md px-4 py-1">分幕</button>
          <button className="border rounded-md px-4 py-1">剧本</button>
        </div>
        
        {/* 操作按钮组 */}
        <div className="flex flex-col gap-4 w-80">
          <button 
            onClick={handleGenerate}
            className="bg-black text-white py-4 px-6 rounded-md flex justify-between items-center"
          >
            <span>一键生成剧本内容</span>
            <span>›</span>
          </button>
          
          <button className="border py-4 px-6 rounded-md flex justify-between items-center">
            <span>导入我的作品</span>
            <span>›</span>
          </button>
          
          <button className="border py-4 px-6 rounded-md flex justify-between items-center">
            <span>上传我的素材</span>
            <span>›</span>
          </button>
          
          <button 
            onClick={() => setShowModal(true)}
            className="border py-4 px-6 rounded-md flex justify-between items-center"
          >
            <span>不喜欢这个方式？新建工作流</span>
            <span>›</span>
          </button>
        </div>
      </main>
      
      {/* 新建工作流模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">新建工作流</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                剧本标题
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入剧本标题"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                onClick={handleCreateScript}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                disabled={!newTitle.trim()}
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 