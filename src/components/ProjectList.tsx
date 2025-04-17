import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScriptContext } from '../context/ScriptContext';
import { Script } from '../types';

export default function ProjectList() {
  const { scripts, createScript, selectScript } = useScriptContext();
  const navigate = useNavigate();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;
    
    createScript(newProjectTitle, newProjectDescription);
    setNewProjectTitle('');
    setNewProjectDescription('');
    setShowNewProjectModal(false);
  };

  const handleScriptClick = (scriptId: string) => {
    selectScript(scriptId);
    navigate(`/editor/${scriptId}`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">我的剧本项目</h1>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          创建新项目
        </button>
      </div>

      {scripts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">还没有创建任何剧本项目</p>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            创建第一个剧本
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script) => (
            <div
              key={script.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => handleScriptClick(script.id)}
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{script.title}</h2>
                <p className="text-gray-600 line-clamp-2 mb-4">{script.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>角色: {script.characters.length}</span>
                  <span>场景: {script.scenes.length}</span>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-2 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  更新于: {formatDate(script.updatedAt)}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {script.currentStep === 'outline' && '大纲'}
                  {script.currentStep === 'characters' && '人物'}
                  {script.currentStep === 'relationships' && '关系'}
                  {script.currentStep === 'scenes' && '场景'}
                  {script.currentStep === 'draft' && '草稿'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">创建新剧本项目</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                剧本标题
              </label>
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入剧本标题"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                剧本简介
              </label>
              <textarea
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="输入剧本简介（选填）"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                disabled={!newProjectTitle.trim()}
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