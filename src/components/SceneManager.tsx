import { useState } from 'react';
import { useScriptContext } from '../context/ScriptContext';
import { Scene } from '../types';

export default function SceneManager() {
  const { currentScript, addScene, updateScene, updateScript } = useScriptContext();
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newScene, setNewScene] = useState({
    title: '',
    description: '',
    characters: [] as string[],
    content: ''
  });
  const [draggedSceneId, setDraggedSceneId] = useState<string | null>(null);

  if (!currentScript) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">请先选择或创建一个剧本项目</p>
      </div>
    );
  }

  // 按顺序排序的场景
  const sortedScenes = [...currentScript.scenes].sort((a, b) => a.order - b.order);

  const handleEditScene = (scene: Scene) => {
    setEditingScene({ ...scene });
    setShowAddForm(false);
  };

  const handleSaveEdit = () => {
    if (editingScene) {
      updateScene(editingScene);
      setEditingScene(null);
    }
  };

  const handleCreateScene = () => {
    if (newScene.title.trim()) {
      addScene({
        ...newScene,
        characters: newScene.characters.length > 0 ? newScene.characters : []
      });
      setNewScene({
        title: '',
        description: '',
        characters: [],
        content: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteScene = (sceneId: string) => {
    if (!currentScript) return;

    // 获取要删除的场景的序号
    const sceneToDelete = currentScript.scenes.find(s => s.id === sceneId);
    if (!sceneToDelete) return;

    // 筛选掉要删除的场景，并重新排序剩余场景
    const updatedScenes = currentScript.scenes
      .filter(s => s.id !== sceneId)
      .map(scene => {
        if (scene.order > sceneToDelete.order) {
          return { ...scene, order: scene.order - 1 };
        }
        return scene;
      });

    updateScript({
      ...currentScript,
      scenes: updatedScenes
    });
  };

  const handleDragStart = (sceneId: string) => {
    setDraggedSceneId(sceneId);
  };

  const handleDragOver = (e: React.DragEvent, targetSceneId: string) => {
    e.preventDefault();
    if (!draggedSceneId || draggedSceneId === targetSceneId) return;
  };

  const handleDrop = (targetSceneId: string) => {
    if (!draggedSceneId || draggedSceneId === targetSceneId || !currentScript) return;

    const sourceScene = currentScript.scenes.find(s => s.id === draggedSceneId);
    const targetScene = currentScript.scenes.find(s => s.id === targetSceneId);

    if (!sourceScene || !targetScene) return;

    // 创建新的顺序数组
    const updatedScenes = currentScript.scenes.map(scene => {
      if (scene.id === draggedSceneId) {
        return { ...scene, order: targetScene.order };
      }
      if (sourceScene.order < targetScene.order) {
        // 向下移动
        if (scene.order > sourceScene.order && scene.order <= targetScene.order) {
          return { ...scene, order: scene.order - 1 };
        }
      } else {
        // 向上移动
        if (scene.order >= targetScene.order && scene.order < sourceScene.order) {
          return { ...scene, order: scene.order + 1 };
        }
      }
      return scene;
    });

    updateScript({
      ...currentScript,
      scenes: updatedScenes
    });

    setDraggedSceneId(null);
  };

  // 选择角色的复选框
  const CharacterSelector = ({ 
    selectedCharacters, 
    onChange 
  }: { 
    selectedCharacters: string[],
    onChange: (characters: string[]) => void
  }) => {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          参与角色
        </label>
        <div className="grid grid-cols-2 gap-2">
          {currentScript?.characters.map(character => (
            <div key={character.id} className="flex items-center">
              <input
                type="checkbox"
                id={`character-${character.id}`}
                checked={selectedCharacters.includes(character.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedCharacters, character.id]);
                  } else {
                    onChange(selectedCharacters.filter(id => id !== character.id));
                  }
                }}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`character-${character.id}`} className="text-sm">
                {character.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 显示参与角色名称
  const getCharacterNames = (characterIds: string[]) => {
    if (!currentScript) return '无角色';
    
    const names = characterIds.map(id => {
      const character = currentScript.characters.find(c => c.id === id);
      return character?.name || '未知角色';
    });
    
    return names.length > 0 ? names.join('、') : '无角色';
  };

  return (
    <div className="h-full flex">
      {/* 场景列表侧边栏 */}
      <div className="w-1/3 border-r overflow-auto">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">场景列表</h2>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingScene(null);
            }}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            添加新场景
          </button>
        </div>

        {sortedScenes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>暂无场景</p>
            <p className="text-sm mt-1">点击上方按钮添加场景</p>
          </div>
        ) : (
          <ul>
            {sortedScenes.map(scene => (
              <li
                key={scene.id}
                draggable
                onDragStart={() => handleDragStart(scene.id)}
                onDragOver={(e) => handleDragOver(e, scene.id)}
                onDrop={() => handleDrop(scene.id)}
                onClick={() => handleEditScene(scene)}
                className={`p-3 border-b cursor-pointer hover:bg-blue-50 group ${
                  editingScene?.id === scene.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">#{scene.order + 1} {scene.title}</div>
                    <div className="text-sm text-gray-500 truncate">{scene.description.substring(0, 60)}</div>
                    <div className="text-xs text-blue-500 mt-1">角色: {getCharacterNames(scene.characters)}</div>
                  </div>
                  <div className="hidden group-hover:block">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('确定要删除此场景吗？')) {
                          handleDeleteScene(scene.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="删除场景"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 场景编辑区域 */}
      <div className="flex-1 p-4 overflow-auto">
        {showAddForm ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">创建新场景</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  场景标题
                </label>
                <input
                  type="text"
                  value={newScene.title}
                  onChange={e => setNewScene({ ...newScene, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入场景标题"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  场景描述
                </label>
                <textarea
                  value={newScene.description}
                  onChange={e => setNewScene({ ...newScene, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="描述此场景的主要情节和氛围"
                />
              </div>
              
              <CharacterSelector 
                selectedCharacters={newScene.characters} 
                onChange={(characters) => setNewScene({ ...newScene, characters })}
              />
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  场景内容
                </label>
                <textarea
                  value={newScene.content}
                  onChange={e => setNewScene({ ...newScene, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={8}
                  placeholder="详细描述场景中发生的事件、对话和行动"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateScene}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={!newScene.title.trim()}
                >
                  创建场景
                </button>
              </div>
            </div>
          </div>
        ) : editingScene ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">编辑场景</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  场景标题
                </label>
                <input
                  type="text"
                  value={editingScene.title}
                  onChange={e => setEditingScene({ ...editingScene, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  场景描述
                </label>
                <textarea
                  value={editingScene.description}
                  onChange={e => setEditingScene({ ...editingScene, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <CharacterSelector 
                selectedCharacters={editingScene.characters} 
                onChange={(characters) => setEditingScene({ ...editingScene, characters })}
              />
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  场景内容
                </label>
                <textarea
                  value={editingScene.content}
                  onChange={e => setEditingScene({ ...editingScene, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={8}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditingScene(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  保存更改
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <p className="mb-2">👈 请从左侧选择一个场景</p>
            <p>或点击"添加新场景"按钮</p>
            <div className="mt-8 max-w-lg text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">分幕指南:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>将你的故事分成有逻辑的段落，每段代表一个场景或情节</li>
                <li>为每个场景指定参与的角色，这将影响场景的互动方式</li>
                <li>考虑时间线和地点变化来划分场景</li>
                <li>场景可以通过拖拽重新排序</li>
                <li>完成分幕后，系统将自动生成故事草稿</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 