import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';

interface ActsViewProps {
  feedbackText: string;
  handleFeedbackSubmit: (e: React.FormEvent) => void;
  setFeedbackText: (text: string) => void;
}

export default function ActsView({ feedbackText, handleFeedbackSubmit, setFeedbackText }: ActsViewProps) {
  // 角色视图与剧情视图切换
  const [showCharactersView, setShowCharactersView] = useState(true);
  
  // 工作区位置状态（从右向左的偏移量，0表示完全展开，大于0表示部分收起）
  const [workspaceOffset, setWorkspaceOffset] = useState(0); // 默认完全展开
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const maxOffset = 400; // 最大收起距离

  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startOffsetRef.current = workspaceOffset;
    document.body.style.cursor = 'ew-resize';
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // 处理拖拽移动
  const handleDragMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    // 向右拖动时，增加偏移量（收起）；向左拖动时，减少偏移量（展开）
    const deltaX = startXRef.current - e.clientX;
    const newOffset = Math.max(0, Math.min(maxOffset, startOffsetRef.current + deltaX));
    setWorkspaceOffset(newOffset);
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    isDraggingRef.current = false;
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // 清理事件监听器
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, []);

  return (
    <div 
      className="flex flex-col h-full relative"
      style={{ 
        transform: `translateX(${workspaceOffset}px)`,
        transition: isDraggingRef.current ? 'none' : 'transform 0.2s ease-out',
        width: `calc(100% - ${workspaceOffset}px)`
      }}
    >
      {/* 左侧拖拽句柄 */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-2 bg-gray-200 hover:bg-blue-400 cursor-ew-resize z-10 opacity-0 hover:opacity-30 transition-opacity"
        onMouseDown={handleDragStart}
        style={{ width: '8px' }}
      ></div>

      {/* 分幕视图 - 调整顶部区域高度 */}
      <div className="flex justify-between items-start mb-2 border-b pb-0 flex-shrink-0">
        {/* 顶部只保留视图切换部分, 删除文风 */}
        <div className="flex items-center space-x-4">
          {/* 文风已删除 */}
        </div>
        
        {/* 角色视图和剧情视图切换 - 再向上移动 */}
        <div className="flex items-center self-start pr-[220px] -mt-14">
          <span className={`mr-2 text-sm ${showCharactersView ? 'font-semibold' : ''}`}>角色视图</span>
          <div 
            className="w-[70px] h-7 bg-gray-200 rounded-full p-1 cursor-pointer relative"
            onClick={() => setShowCharactersView(!showCharactersView)}
          >
            <div 
              className={`w-6 h-6 rounded-full absolute top-[2px] transform transition-all duration-300 ease-in-out ${
                showCharactersView ? 'translate-x-0 bg-gray-400' : 'translate-x-[38px] bg-black'
              }`}
            ></div>
          </div>
          <span className={`ml-2 text-sm ${!showCharactersView ? 'font-semibold' : ''}`}>剧情视图</span>
        </div>
      </div>
      
      {/* 分幕表格区域 - 使用flex-1确保表格填充剩余空间 */}
      <div className="flex-1 overflow-auto m-2 flex flex-col">
        <table className="w-full border-collapse mb-auto">
          <thead>
            <tr>
              <th className="border p-3 bg-gray-50 font-medium text-sm">角色</th>
              <th className="border p-3 bg-gray-50 font-medium text-sm whitespace-nowrap">时间线</th>
              <th className="border p-3 bg-gray-50 font-medium text-sm">关键事件：</th>
              <th className="border p-3 bg-gray-50 font-medium text-sm whitespace-nowrap">情感变化</th>
              <th className="border p-3 bg-gray-50 font-medium text-sm">人物关系：</th>
              <th className="border p-3 bg-gray-50 font-medium text-sm">人物塑造效果：</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border">
              <td className="border p-3 align-top" rowSpan={4}>
                苏飞卿
              </td>
              <td className="border p-3 align-top"></td>
              <td className="border p-3 align-top">
                <p>1. 主角苏飞卿从小被梦魇缠身，梦见一位金发女子在火海中消失</p>
                <p>2. 苏飞卿违反军令私自出兵救援平安城，结果功亏一篑并受罚</p>
                <p>3. 苏飞卿奉命入京为太子陪读</p>
                <p>4. 苏飞卿处事谨慎却被卷入政治斗争</p>
              </td>
              <td className="border p-3 align-top"></td>
              <td className="border p-3 align-top">
                <p>1. 苏飞卿与父母：传统的将门子弟，父严母慈，备受期待</p>
                <p>2. 苏飞卿与太子：表兄弟关系，互相信任</p>
                <p>3. 苏飞卿与阿离：一见钟情却注定悲剧</p>
              </td>
              <td className="border p-3 align-top">
                <p>1. 展现了苏飞卿少年狂妄和重情重义的性格</p>
                <p>2. 凸显了阿离身份的神秘性和复杂性</p>
                <p>3. 体现了各方势力之间的政治博弈</p>
                <p>4. 埋伏笔，伏笔朝廷内部对外战争的隐忧</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* 底部区域 - 固定在底部位置 */}
      <div className="space-y-2 mt-auto mb-4 px-4">
        {/* 对话气泡 */}
        <div className="w-full flex justify-end mb-2">
          <div className="relative max-w-[85%]">
            <div className="bg-black text-white py-2 px-3 rounded-xl text-sm">
              <span>角色1和角色2在xxx发生了xxx而不是xxx</span>
            </div>
            <div 
              className="absolute right-[-6px] top-1/2 -translate-y-1/2"
              style={{
                width: 0,
                height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: '8px solid black'
              }}
            ></div>
          </div>
        </div>
        
        {/* 提示信息和选项组合 */}
        <div className="max-w-xl mx-auto space-y-2">
          <div className="border border-gray-200 rounded-2xl p-3 text-gray-600 bg-white shadow-sm text-sm min-h-[60px]">
            <p className="break-words">根据xxxxxxxx，为您提供以下内容选择：</p>
          </div>
          
          {/* 选择框 - 多个对齐排列 */}
          <div className="border border-gray-200 rounded-2xl p-3 bg-white shadow hover:shadow transition-shadow duration-200">
            <p className="text-sm break-words">1. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
          </div>
          
          <div className="border border-gray-200 rounded-2xl p-3 bg-white shadow hover:shadow transition-shadow duration-200">
            <p className="text-sm break-words">2. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
          </div>
          
          <div className="border border-gray-200 rounded-2xl p-3 bg-white shadow hover:shadow transition-shadow duration-200">
            <p className="text-sm break-words">3. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
          </div>
          
          {/* 点击替换提示 */}
          <div className="border border-gray-200 rounded-2xl p-3 text-gray-600 bg-white shadow-sm hover:shadow transition-shadow duration-200">
            <p className="text-gray-700 text-sm break-words">点击替换。这个方向对吗? 还是从xxxxxxxxxx展开?</p>
          </div>
        </div>
        
        {/* 底部输入区域 - 保持原宽度 */}
        <div className="max-w-3xl mx-auto">
          {/* 大模型选择器 */}
          <div className="flex items-center mb-2 justify-end">
            <div className="bg-gray-100 rounded-md px-2 py-1.5 border border-gray-200 flex items-center text-sm">
              <Icon icon="carbon:ai" width="20" height="20" inline={true} className="text-gray-700 mr-1.5" />
              <span className="text-sm">claude35_sonnet2</span>
              <Icon icon="lucide:chevron-down" width="14" height="14" inline={true} className="text-gray-500 ml-1.5" />
            </div>
          </div>
          
          {/* 输入框 - 保持原宽度 */}
          <form onSubmit={handleFeedbackSubmit} className="border border-gray-200 rounded-2xl p-3 bg-white shadow-sm hover:shadow transition-shadow duration-200">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="这段内容不好? 点击单元格，告诉我如何优化，如: xxxxxx"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full focus:outline-none text-gray-700 text-sm"
              />
              <button type="submit" className="text-gray-500 hover:text-gray-700 flex-shrink-0">
                <Icon icon="lucide:send" width="18" height="18" inline={true} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 