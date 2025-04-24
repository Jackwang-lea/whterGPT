import { useState } from 'react';
import { useCopilotContext } from '../context/CopilotContext';

export default function KnowledgeManager() {
  const { knowledgeFragments } = useCopilotContext();
  // uploadKnowledgeFragment在接口中不存在，我们可以自定义一个函数
  const uploadKnowledgeFragment = (fragment: any) => {
    console.log('上传知识片段', fragment);
    // 实际实现时可以调用API或其他方式存储
  };
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [tags, setTags] = useState('');
  const [filter, setFilter] = useState('');

  const handleUpload = () => {
    if (!title.trim() || !content.trim()) return;
    
    uploadKnowledgeFragment({
      title,
      content,
      source,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
    
    setTitle('');
    setContent('');
    setSource('');
    setTags('');
    setShowUploadModal(false);
  };

  const filteredFragments = filter.trim()
    ? knowledgeFragments.filter(fragment => 
        fragment.title.toLowerCase().includes(filter.toLowerCase()) ||
        fragment.content.toLowerCase().includes(filter.toLowerCase()) ||
        fragment.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
      )
    : knowledgeFragments;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">知识碎片库</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          上传新素材
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="搜索知识碎片..."
        />
      </div>

      {filteredFragments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">还没有任何知识碎片</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            上传第一个知识碎片
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFragments.map((fragment) => (
            <div key={fragment.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">{fragment.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-3">{fragment.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {fragment.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {typeof fragment.createdAt === 'number' || typeof fragment.createdAt === 'string' 
                    ? new Date(fragment.createdAt).toLocaleDateString() 
                    : '无日期'}
                </div>
              </div>
              {fragment.source && (
                <div className="mt-2 text-sm text-gray-500">
                  来源: {fragment.source}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">上传知识碎片</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="碎片标题"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                内容
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                placeholder="碎片内容"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                来源（选填）
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="如：书籍、电影、网站等"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                标签（用逗号分隔）
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="如：情感、悬疑、人物刻画"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                disabled={!title.trim() || !content.trim()}
              >
                上传
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 