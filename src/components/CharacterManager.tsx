import { useState } from 'react';
import { useScriptContext } from '../context/ScriptContext';
import { Character, Relationship } from '../types';

export default function CharacterManager() {
  const { currentScript, updateCharacter, addCharacter } = useScriptContext();
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddRelationshipForm, setShowAddRelationshipForm] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<{
    index: number;
    relationship: Relationship;
  } | null>(null);
  const [newRelationship, setNewRelationship] = useState<{
    targetId: string;
    type: string;
    description: string;
  }>({
    targetId: '',
    type: '',
    description: ''
  });
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    description: '',
    background: ''
  });

  if (!currentScript) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">请先选择或创建一个剧本项目</p>
      </div>
    );
  }

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter({ ...character });
    setShowAddForm(false);
    setShowAddRelationshipForm(false);
    setEditingRelationship(null);
  };

  const handleSaveEdit = () => {
    if (editingCharacter) {
      updateCharacter(editingCharacter);
      setEditingCharacter(null);
    }
  };

  const handleCreateCharacter = () => {
    if (newCharacter.name.trim()) {
      addCharacter(newCharacter);
      setNewCharacter({
        name: '',
        description: '',
        background: ''
      });
      setShowAddForm(false);
    }
  };

  const handleAddRelationship = () => {
    if (!editingCharacter || !newRelationship.targetId || !newRelationship.type.trim()) return;
    
    const updatedCharacter = {
      ...editingCharacter,
      relationships: {
        ...editingCharacter.relationships || {},
        [newRelationship.targetId]: newRelationship.description || newRelationship.type
      }
    };
    
    setEditingCharacter(updatedCharacter);
    setNewRelationship({
      targetId: '',
      type: '',
      description: ''
    });
    setShowAddRelationshipForm(false);
  };

  const handleUpdateRelationship = () => {
    if (!editingCharacter || !editingRelationship) return;
    
    const updatedRelationships = { 
      ...editingCharacter.relationships || {}
    };
    updatedRelationships[editingRelationship.relationship.targetId] = 
      editingRelationship.relationship.description || editingRelationship.relationship.type;
    
    setEditingCharacter({
      ...editingCharacter,
      relationships: updatedRelationships
    });
    
    setEditingRelationship(null);
  };

  const handleRemoveRelationship = (index: number) => {
    if (!editingCharacter || !editingCharacter.relationships) return;
    
    const relationshipEntries = Object.entries(editingCharacter.relationships);
    const keyToRemove = relationshipEntries[index][0];
    
    const updatedRelationships = { ...editingCharacter.relationships };
    delete updatedRelationships[keyToRemove];
    
    setEditingCharacter({
      ...editingCharacter,
      relationships: updatedRelationships
    });
  };

  // 获取其他可以建立关系的角色（排除当前编辑的角色）
  const getOtherCharacters = () => {
    if (!editingCharacter) return [];
    return currentScript.characters.filter(c => c.id !== editingCharacter.id);
  };

  // 关系类型选项
  const relationshipTypes = [
    "朋友", "敌人", "情侣", "夫妻", "亲戚", "上下级", "同事", "竞争对手", "师徒", "陌生人", "合作伙伴", "其他"
  ];

  return (
    <div className="h-full flex">
      {/* 角色列表侧边栏 */}
      <div className="w-1/3 border-r overflow-auto">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">角色列表</h2>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingCharacter(null);
              setShowAddRelationshipForm(false);
              setEditingRelationship(null);
            }}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            添加新角色
          </button>
        </div>

        {currentScript.characters.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>暂无角色</p>
            <p className="text-sm mt-1">点击上方按钮添加角色</p>
          </div>
        ) : (
          <ul>
            {currentScript.characters.map(character => (
              <li
                key={character.id}
                onClick={() => handleEditCharacter(character)}
                className={`p-3 border-b cursor-pointer hover:bg-blue-50 ${
                  editingCharacter?.id === character.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="font-medium">{character.name}</div>
                <div className="text-sm text-gray-500 truncate">{character.description.substring(0, 60)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 角色编辑区域 */}
      <div className="flex-1 p-4 overflow-auto">
        {showAddForm ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">创建新角色</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  角色名称
                </label>
                <input
                  type="text"
                  value={newCharacter.name}
                  onChange={e => setNewCharacter({ ...newCharacter, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入角色名称"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  角色描述
                </label>
                <textarea
                  value={newCharacter.description}
                  onChange={e => setNewCharacter({ ...newCharacter, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="简短描述这个角色的主要特点"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  背景故事
                </label>
                <textarea
                  value={newCharacter.background}
                  onChange={e => setNewCharacter({ ...newCharacter, background: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="详细描述角色的背景故事、动机与性格"
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
                  onClick={handleCreateCharacter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={!newCharacter.name.trim()}
                >
                  创建角色
                </button>
              </div>
            </div>
          </div>
        ) : editingCharacter ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">编辑角色</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  角色名称
                </label>
                <input
                  type="text"
                  value={editingCharacter.name}
                  onChange={e => setEditingCharacter({ ...editingCharacter, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  角色描述
                </label>
                <textarea
                  value={editingCharacter.description}
                  onChange={e => setEditingCharacter({ ...editingCharacter, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  背景故事
                </label>
                <textarea
                  value={editingCharacter.background}
                  onChange={e => setEditingCharacter({ ...editingCharacter, background: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                />
              </div>
              
              {/* 人物关系区域 */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-700 text-sm font-bold">人物关系</h3>
                  {getOtherCharacters().length > 0 && !showAddRelationshipForm && !editingRelationship && (
                    <button
                      onClick={() => {
                        setShowAddRelationshipForm(true);
                        setEditingRelationship(null);
                        setNewRelationship({
                          targetId: getOtherCharacters()[0]?.id || '',
                          type: '',
                          description: '',
                        });
                      }}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      添加关系
                    </button>
                  )}
                </div>
                
                {/* 添加新关系表单 */}
                {showAddRelationshipForm && (
                  <div className="mt-3 p-3 border rounded-md bg-gray-50">
                    <h4 className="font-medium mb-2">添加新关系</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          选择角色
                        </label>
                        <select
                          value={newRelationship.targetId}
                          onChange={e => setNewRelationship({
                            ...newRelationship,
                            targetId: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          {getOtherCharacters().map(character => (
                            <option key={character.id} value={character.id}>
                              {character.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          关系类型
                        </label>
                        <select
                          value={newRelationship.type}
                          onChange={e => setNewRelationship({
                            ...newRelationship,
                            type: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">请选择关系类型</option>
                          {relationshipTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          关系描述
                        </label>
                        <textarea
                          value={newRelationship.description}
                          onChange={e => setNewRelationship({
                            ...newRelationship,
                            description: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          rows={2}
                          placeholder="描述两人的关系细节"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowAddRelationshipForm(false)}
                          className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleAddRelationship}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          disabled={!newRelationship.targetId || !newRelationship.type}
                        >
                          添加
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 编辑关系表单 */}
                {editingRelationship && (
                  <div className="mt-3 p-3 border rounded-md bg-gray-50">
                    <h4 className="font-medium mb-2">编辑关系</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          角色
                        </label>
                        <select
                          value={editingRelationship.relationship.targetId}
                          onChange={e => setEditingRelationship({
                            ...editingRelationship,
                            relationship: {
                              ...editingRelationship.relationship,
                              targetId: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          {getOtherCharacters().map(character => (
                            <option key={character.id} value={character.id}>
                              {character.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          关系类型
                        </label>
                        <select
                          value={editingRelationship.relationship.type}
                          onChange={e => setEditingRelationship({
                            ...editingRelationship,
                            relationship: {
                              ...editingRelationship.relationship,
                              type: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">请选择关系类型</option>
                          {relationshipTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          关系描述
                        </label>
                        <textarea
                          value={editingRelationship.relationship.description}
                          onChange={e => setEditingRelationship({
                            ...editingRelationship,
                            relationship: {
                              ...editingRelationship.relationship,
                              description: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          rows={2}
                          placeholder="描述两人的关系细节"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingRelationship(null)}
                          className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleUpdateRelationship}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          disabled={!editingRelationship.relationship.targetId || !editingRelationship.relationship.type}
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 现有关系列表 */}
                {!editingRelationship && (
                  <div className="mt-3">
                    {editingCharacter.relationships && Object.entries(editingCharacter.relationships).length > 0 ? (
                      <ul className="space-y-2">
                        {Object.entries(editingCharacter.relationships).map(([targetId, description], index) => {
                          const targetCharacter = currentScript.characters.find(c => c.id === targetId);
                          return (
                            <li key={targetId} className="p-2 border rounded bg-gray-50 relative group">
                              <div className="font-medium">
                                与 <span className="text-blue-600">{targetCharacter?.name || '未知角色'}</span> 的关系
                              </div>
                              <div className="text-sm">类型: {targetId === description ? '自定义' : description}</div>
                              <div className="text-sm">{targetId === description ? description : ''}</div>
                              
                              {/* 操作按钮，鼠标悬停时显示 */}
                              <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingRelationship({
                                      index,
                                      relationship: {
                                        targetId,
                                        type: targetId === description ? '自定义' : description,
                                        description: targetId === description ? description : ''
                                      }
                                    });
                                    setShowAddRelationshipForm(false);
                                  }}
                                  className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                  title="编辑"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveRelationship(index);
                                  }}
                                  className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                  title="删除"
                                >
                                  🗑️
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm mt-2">暂无关系设定</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditingCharacter(null)}
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
            <p className="mb-2">👈 请从左侧选择一个角色</p>
            <p>或点击"添加新角色"按钮</p>
          </div>
        )}
      </div>
    </div>
  );
} 