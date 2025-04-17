import { useState, useEffect, useCallback } from 'react';
import { useScriptContext } from '../context/ScriptContext';

export default function ScriptEditor() {
  const { currentScript, updateOutline, saveEditPosition } = useScriptContext();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [lastSavedContent, setLastSavedContent] = useState('');
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  useEffect(() => {
    if (currentScript) {
      setContent(currentScript.outline || '');
      setLastSavedContent(currentScript.outline || '');
    }
  }, [currentScript]);

  const saveContent = useCallback(() => {
    if (!currentScript || content === lastSavedContent) return;
    
    updateOutline(content);
    setLastSavedContent(content);
    showSaveSuccess();
    saveEditPosition({
      cursorPosition: document.activeElement instanceof HTMLTextAreaElement 
        ? document.activeElement.selectionStart 
        : undefined
    });
  }, [content, currentScript, lastSavedContent, updateOutline, saveEditPosition]);

  // 自动保存功能 - 当内容改变且停止输入1秒后自动保存
  useEffect(() => {
    if (!currentScript || content === lastSavedContent) return;
    
    const saveTimer = setTimeout(() => {
      saveContent();
    }, 1000);
    
    return () => clearTimeout(saveTimer);
  }, [content, currentScript, lastSavedContent, saveContent]);

  // 添加页面卸载前保存
  useEffect(() => {
    // 在组件卸载前保存
    return () => {
      if (content !== lastSavedContent) {
        updateOutline(content);
      }
    };
  }, [content, lastSavedContent, updateOutline]);

  // 添加路由切换前保存
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (content !== lastSavedContent) {
        // 在页面关闭/刷新前保存
        updateOutline(content);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [content, lastSavedContent, updateOutline]);

  const showSaveSuccess = () => {
    setShowSaveNotification(true);
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 2000);
  };

  if (!currentScript) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">请先选择或创建一个剧本项目</p>
      </div>
    );
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    saveContent();
  };

  // Function to highlight character references (@CharacterName)
  const renderMarkdown = (text: string) => {
    // Replace character references with styled spans
    let formattedText = text.replace(
      /@(\w+)/g, 
      '<span class="text-blue-600 font-medium">@$1</span>'
    );
    
    // Replace headers (# Header)
    formattedText = formattedText.replace(
      /^(#{1,6})\s+(.+)$/gm,
      (_, hashtags, content) => {
        const level = hashtags.length;
        const className = `text-${22 - level * 2}px font-bold my-2`;
        return `<div class="${className}">${content}</div>`;
      }
    );
    
    // Replace bullet points
    formattedText = formattedText.replace(
      /^[ \t]*[-*][ \t]+(.+)$/gm,
      '<div class="ml-4 flex"><span class="mr-2">•</span>$1</div>'
    );
    
    // Convert line breaks to <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return formattedText;
  };

  return (
    <div className="h-full flex flex-col relative">
      {showSaveNotification && (
        <div className="absolute top-2 right-2 bg-green-100 text-green-700 px-4 py-2 rounded shadow-md z-10 animate-fadeIn">
          内容已自动保存
        </div>
      )}
      
      <div className="bg-white shadow-sm border-b px-4 py-2 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">{currentScript.title}</h1>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500">
            {content !== lastSavedContent ? '编辑中...' : '已保存'}
          </span>
          <button
            onClick={() => {
              // 切换到预览之前先保存
              if (isEditing && content !== lastSavedContent) {
                saveContent();
              }
              setIsEditing(!isEditing);
            }}
            className="px-3 py-1 text-sm border rounded-md text-gray-600 hover:bg-gray-50"
          >
            {isEditing ? '预览' : '编辑'}
          </button>
          {isEditing && content !== lastSavedContent && (
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              保存
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isEditing ? (
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-full p-4 resize-none focus:outline-none font-mono"
            placeholder="在此处编写剧本大纲，可以使用 @角色名 来引用角色..."
            onBlur={handleSave}
          />
        ) : (
          <div 
            className="p-4 markdown-preview"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
      </div>
    </div>
  );
}