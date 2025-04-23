import { Icon } from '@iconify/react';

interface ScriptViewProps {
  selectedModel: string;
  feedbackText: string;
  handleFeedbackSubmit: (e: React.FormEvent) => void;
  setFeedbackText: (text: string) => void;
}

export default function ScriptView({ 
  selectedModel, 
  feedbackText, 
  handleFeedbackSubmit, 
  setFeedbackText 
}: ScriptViewProps) {
  return (
    <>
      {/* 模型和知识库选择 */}
      <div className="px-4 flex justify-center items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-2 border border-gray-200">
          <Icon icon="lucide:sparkles" width="24" height="24" inline={true} className="text-gray-700" />
          <span className="text-sm">{selectedModel}</span>
          <Icon icon="lucide:chevron-down" width="16" height="16" inline={true} className="text-gray-500" />
        </div>
        
        <div className="bg-white px-3 py-2 text-gray-700">
          文风
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-2 border border-gray-200">
          <Icon icon="lucide:database" width="18" height="18" inline={true} className="text-gray-700 mr-1" /> 
          <span className="text-sm">知识库: xxxxxx</span>
          <Icon icon="lucide:chevron-down" width="16" height="16" inline={true} className="text-gray-500" />
        </div>
      </div>
      
      {/* 主要内容区 */}
      <div className="flex-1 flex flex-col px-4 space-y-4 pb-4">
        {/* 角色对话 */}
        <div className="w-full flex justify-end mb-3">
          <div className="relative max-w-[85%]">
            {/* 主要内容区 */}
            <div className="bg-black text-white py-3 px-4 rounded-xl">
              <span>角色1和角色2在xxx发生了xxx而不是xxx</span>
            </div>
            {/* 右侧气泡尾巴 */}
            <div 
              className="absolute right-[-8px] top-1/2 -translate-y-1/2"
              style={{
                width: 0,
                height: 0,
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderLeft: '10px solid black'
              }}
            ></div>
          </div>
        </div>
        
        {/* 提示信息 */}
        <div className="border border-gray-200 rounded-lg p-4 text-gray-600 max-w-3xl ml-4">
          <p>根据xxxxxxxx，为您提供以下内容选择：</p>
        </div>
        
        {/* 选项1 */}
        <div className="border border-gray-200 rounded-lg p-4 overflow-y-auto max-w-3xl ml-4 relative">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-400 rounded-full"></div>
          <p className="text-sm pr-3">1. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        </div>
        
        {/* 选项2 */}
        <div className="border border-gray-200 rounded-lg p-4 overflow-y-auto max-w-3xl ml-4">
          <p className="text-sm">2. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        </div>
        
        {/* 选项3 */}
        <div className="border border-gray-200 rounded-lg p-4 overflow-y-auto max-w-3xl ml-4">
          <p className="text-sm">3. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        </div>
        
        {/* 页面询问 */}
        <div className="border border-gray-200 rounded-lg p-4 text-gray-600 max-w-3xl ml-4">
          <p>点击替换。这个方向对吗? 还是从xxxxxxxxxx展开?</p>
        </div>
        
        {/* 反馈输入框 - 修改为真正的输入框 */}
        <form onSubmit={handleFeedbackSubmit} className="border border-gray-200 rounded-lg p-4 max-w-3xl ml-4">
          <input
            type="text"
            placeholder="剧情不好? 告诉我如何优化，如: xxxxxxx"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full focus:outline-none text-gray-700"
          />
        </form>
      </div>
    </>
  );
} 