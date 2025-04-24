import { useState, useEffect } from 'react';
import { useScriptContext } from '../context/ScriptContext';

export default function DraftGenerator() {
  const { currentScript, updateOutline } = useScriptContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (currentScript) {
      setDraftContent(currentScript.outline);
      
      // 如果还没有初稿内容，自动生成
      if (!currentScript.outline.includes(`# ${currentScript.title} - 初稿`)) {
        generateDraft();
      }
    }
  }, [currentScript]);

  if (!currentScript) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">请先选择或创建一个剧本项目</p>
      </div>
    );
  }

  const generateDraft = () => {
    setIsGenerating(true);
    
    try {
      // 基于现有场景生成初稿框架
      const draftSections = (currentScript.scenes || [])
        .sort((a, b) => a.order - b.order)
        .map(scene => {
          // 获取参与此场景的角色
          const characters = scene.characters.map(charId => {
            const character = (currentScript.characters || []).find(c => c.id === charId);
            return character ? character : null;
          }).filter(c => c !== null);
          
          // 构建场景标题和描述
          let sceneContent = `## 第${scene.order + 1}幕：${scene.title}\n\n`;
          sceneContent += `**场景描述**：${scene.description}\n\n`;
          
          // 添加参与角色信息
          if (characters.length > 0) {
            sceneContent += `**参与角色**：${characters.map(c => c?.name).join('、')}\n\n`;
            
            // 添加角色关系提示（如果有）
            const relationshipNotes: string[] = [];
            characters.forEach(char1 => {
              if (!char1) return;
              
              char1.relationships.forEach(rel => {
                const char2 = (currentScript.characters || []).find(c => c.id === rel.target);
                if (char2 && scene.characters.includes(char2.id)) {
                  relationshipNotes.push(`${char1.name}与${char2.name}：${rel.type} - ${rel.description}`);
                }
              });
            });
            
            if (relationshipNotes.length > 0) {
              sceneContent += "**角色关系**：\n";
              relationshipNotes.forEach(note => {
                sceneContent += `- ${note}\n`;
              });
              sceneContent += "\n";
            }
          }
          
          // 添加场景内容
          if (scene.content && scene.content.trim() !== '') {
            sceneContent += "**场景内容**：\n\n";
            sceneContent += scene.content;
          } else {
            sceneContent += "*此场景内容待补充*";
          }
          
          sceneContent += "\n\n---\n\n";
          return sceneContent;
        }).join('');
      
      // 构建完整的剧本
      const fullDraft = `# ${currentScript.title} - 初稿\n\n`;
      
      // 添加剧本概述
      const scriptOverview = `## 剧本概述\n\n${currentScript.description || '无描述'}\n\n---\n\n`;
      
      // 添加人物列表
      let characterSection = `## 角色列表\n\n`;
      (currentScript.characters || []).forEach(character => {
        characterSection += `### ${character.name}\n\n`;
        characterSection += `${character.description}\n\n`;
        characterSection += `**背景**：${character.background || '无背景信息'}\n\n`;
        
        if (character.relationships.length > 0) {
          characterSection += `**与其他角色的关系**：\n`;
          character.relationships.forEach(rel => {
            const target = (currentScript.characters || []).find(c => c.id === rel.target);
            if (target) {
              characterSection += `- 与${target.name}：${rel.type} - ${rel.description}\n`;
            }
          });
          characterSection += '\n';
        }
      });
      characterSection += `---\n\n`;
      
      // 组合完整内容
      const completeDraft = fullDraft + scriptOverview + characterSection + draftSections;
      
      // 更新内容
      setDraftContent(completeDraft);
      updateOutline(completeDraft);
    } catch (error) {
      console.error('生成剧本时出错:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftContent(e.target.value);
    updateOutline(e.target.value);
  };

  const handleSave = () => {
    updateOutline(draftContent);
    // 显示保存成功提示
    const saveNotification = document.getElementById('save-notification');
    if (saveNotification) {
      saveNotification.classList.remove('opacity-0');
      setTimeout(() => {
        saveNotification.classList.add('opacity-0');
      }, 2000);
    }
  };

  // 渲染预览markdown（简化版）
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-semibold my-3">$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-medium my-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/---/g, '<hr class="my-4">')
      .replace(/\n\n/g, '<p class="my-2"></p>')
      .replace(/- (.*?)$/gm, '<li class="ml-5">$1</li>');
  };

  return (
    <div className="h-full flex flex-col">
      {/* 工具栏 */}
      <div className="bg-gray-100 border-b p-3 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={generateDraft}
            disabled={isGenerating}
            className={`px-3 py-1.5 rounded-md text-white ${isGenerating ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isGenerating ? '生成中...' : '重新生成剧本'}
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            {showPreview ? '编辑模式' : '预览模式'}
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div id="save-notification" className="text-green-600 transition-opacity duration-500 opacity-0">
            已保存 ✓
          </div>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            保存剧本
          </button>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="flex-1 overflow-auto">
        {showPreview ? (
          <div 
            className="p-6 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(draftContent) }}
          />
        ) : (
          <textarea
            value={draftContent}
            onChange={handleContentChange}
            className="w-full h-full p-4 font-mono text-sm border-0 resize-none focus:outline-none"
          />
        )}
      </div>
    </div>
  );
} 