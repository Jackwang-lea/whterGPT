import { useState, useEffect } from 'react';
import { useScriptContext } from '../context/ScriptContext';

export default function ScriptEditor() {
  const { currentScript, updateOutline, saveEditPosition } = useScriptContext();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    if (currentScript) {
      setContent(currentScript.outline || '');
    }
  }, [currentScript]);

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
    updateOutline(content);
    saveEditPosition({
      cursorPosition: document.activeElement instanceof HTMLTextAreaElement 
        ? document.activeElement.selectionStart 
        : undefined
    });
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
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm border-b px-4 py-2 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">{currentScript.title}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 text-sm border rounded-md text-gray-600 hover:bg-gray-50"
          >
            {isEditing ? '预览' : '编辑'}
          </button>
          {isEditing && (
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