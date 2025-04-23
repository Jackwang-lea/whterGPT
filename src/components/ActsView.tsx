import { Icon } from '@iconify/react';
import { useState } from 'react';

interface ActsViewProps {
  feedbackText: string;
  handleFeedbackSubmit: (e: React.FormEvent) => void;
  setFeedbackText: (text: string) => void;
}

export default function ActsView({ feedbackText, handleFeedbackSubmit, setFeedbackText }: ActsViewProps) {
  // 角色视图与剧情视图切换
  const [showCharactersView, setShowCharactersView] = useState(true);

  return (
    <div className="flex-1 flex flex-col px-6 py-4">
      {/* 分幕视图 - 调整顶部区域高度 */}
      <div className="flex justify-between items-start mb-2 border-b pb-0">
        {/* 顶部只保留视图切换部分, 删除文风 */}
        <div className="flex items-center space-x-4">
          {/* 文风已删除 */}
        </div>
        
        {/* 角色视图和剧情视图切换 - 再向上移动 */}
        <div className="flex items-center self-start pr-[220px] -mt-14">
          <span className="mr-2 text-sm">角色视图</span>
          <div 
            className="w-12 h-6 bg-gray-200 rounded-full p-1 cursor-pointer"
            onClick={() => setShowCharactersView(!showCharactersView)}
          >
            <div 
              className={`w-4 h-4 rounded-full transform duration-300 ease-in-out ${
                showCharactersView ? 'bg-black translate-x-6' : 'bg-gray-400 translate-x-0'
              }`}
            ></div>
          </div>
          <span className="ml-2 text-sm">剧情视图</span>
        </div>
      </div>
      
      {/* 分幕表格区域 */}
      <div className="flex-1 overflow-auto m-2">
        <table className="w-full border-collapse">
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
      
      {/* 底部区域 */}
      <div className="mt-4 space-y-3">
        {/* 对话气泡 - 确保能显示 */}
        <div className="w-full flex justify-end mb-2">
          <div className="relative max-w-[85%]">
            <div className="bg-black text-white py-3 px-4 rounded-xl">
              <span>角色1和角色2在xxx发生了xxx而不是xxx</span>
            </div>
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
        <div className="border border-gray-200 rounded-lg p-4 text-gray-600 max-w-5xl ml-4">
          <p>根据xxxxxxxx，为您提供以下内容选择：</p>
        </div>
        
        {/* 选项 - 修改为一行显示 */}
        <div className="border border-gray-200 rounded-lg p-4 overflow-x-auto max-w-5xl ml-4 relative">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-400 rounded-full"></div>
          <p className="text-sm pr-3 whitespace-nowrap">1. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        </div>
        
        {/* 大模型选择器 - 放在底部输入框上方 */}
        <div className="flex items-center mb-2">
          <div className="bg-gray-100 rounded-md px-3 py-2 border border-gray-200 flex items-center">
            <Icon icon="carbon:ai" width="24" height="24" inline={true} className="text-gray-700 mr-2" />
            <span className="text-sm">claude35_sonnet2</span>
            <Icon icon="lucide:chevron-down" width="16" height="16" inline={true} className="text-gray-500 ml-2" />
          </div>
        </div>
        
        {/* 底部输入框 */}
        <form onSubmit={handleFeedbackSubmit} className="border border-gray-200 rounded-lg p-4">
          <input
            type="text"
            placeholder="这段内容不好? 点击单元格，告诉我如何优化，如: xxxxxx"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full focus:outline-none text-gray-700"
          />
        </form>
      </div>
    </div>
  );
} 