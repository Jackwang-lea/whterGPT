import { Icon } from '@iconify/react';
import { useState } from 'react';

interface OutlineViewProps {
  feedbackText: string;
  handleFeedbackSubmit: (e: React.FormEvent) => void;
  setFeedbackText: (text: string) => void;
}

export default function OutlineView({ feedbackText, handleFeedbackSubmit, setFeedbackText }: OutlineViewProps) {
  const [outlineStyle, setOutlineStyle] = useState<string>('古风情感');
  const [settingType, setSettingType] = useState<string>('逆向时空');
  const [selectedModel, setSelectedModel] = useState<string>('claude35_sonnet2');
  const [exampleTemplate, setExampleTemplate] = useState<string>('《古相思曲》-大纲');

  return (
    <div className="flex flex-1">
      {/* 左侧内容区 */}
      <div className="w-2/3 px-6 py-4 overflow-auto">
        {/* 大纲设置 */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="text-base font-medium mr-4">大纲风格</div>
            <div className="relative w-40">
              <select 
                className="block w-full px-4 py-2 appearance-none bg-white border border-gray-300 rounded-md focus:outline-none"
                value={outlineStyle}
                onChange={(e) => setOutlineStyle(e.target.value)}
              >
                <option>古风情感</option>
                <option>现代都市</option>
                <option>科幻冒险</option>
                <option>悬疑推理</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Icon icon="lucide:chevron-down" width="16" height="16" />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-base font-medium mr-4">关键设定</div>
            <div className="relative w-40">
              <select 
                className="block w-full px-4 py-2 appearance-none bg-white border border-gray-300 rounded-md focus:outline-none"
                value={settingType}
                onChange={(e) => setSettingType(e.target.value)}
              >
                <option>逆向时空</option>
                <option>末世求生</option>
                <option>穿越重生</option>
                <option>虚拟游戏</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Icon icon="lucide:chevron-down" width="16" height="16" />
              </div>
            </div>
          </div>
        </div>

        {/* 参考案例 */}
        <div className="mb-6">
          <div className="text-base font-medium mb-3">参考案例</div>
          <div className="relative w-full">
            <select 
              className="block w-full px-4 py-2 appearance-none bg-gray-100 border border-gray-300 rounded-md focus:outline-none text-violet-700"
              value={exampleTemplate}
              onChange={(e) => setExampleTemplate(e.target.value)}
            >
              <option>《古相思曲》-大纲</option>
              <option>《快剑侠风》-大纲</option>
              <option>《长安三万里》-大纲</option>
              <option>《琅琊榜》-大纲</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Icon icon="lucide:chevron-down" width="16" height="16" />
            </div>
          </div>
        </div>

        {/* 可选方案 */}
        <div className="mb-6 flex items-center">
          <div className="text-base font-medium mr-4">可选方案</div>
          <div className="flex items-center">
            <Icon icon="simple-icons:anthropic" width="20" height="20" className="mr-2 text-purple-600" />
            <div className="relative w-56">
              <select 
                className="block w-full px-4 py-2 appearance-none bg-white border border-gray-300 rounded-md focus:outline-none"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option>claude35_sonnet2</option>
                <option>gpt-4o</option>
                <option>gemini-1.5-pro</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Icon icon="lucide:chevron-down" width="16" height="16" />
              </div>
            </div>
          </div>
        </div>

        {/* 大纲内容区域 - 三个文本框 */}
        <div className="space-y-4">
          <div className="p-4 border border-gray-300 rounded-lg h-32 overflow-auto bg-white">
            <p className="text-sm text-gray-700">
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </p>
          </div>

          <div className="p-4 border border-gray-300 rounded-lg h-32 overflow-auto bg-white">
            <p className="text-sm text-gray-700">
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </p>
          </div>

          <div className="p-4 border border-gray-300 rounded-lg h-32 overflow-auto bg-white">
            <p className="text-sm text-gray-700">
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </p>
          </div>
        </div>

        {/* AI问答 */}
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-700 mb-4">Q: 您是想要这样的架空历史的大纲内容吗?</div>
          <form onSubmit={handleFeedbackSubmit} className="relative">
            <input
              type="text"
              placeholder="大纲不好? 告诉我如何优化，如: xxxxxxx"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-4 pr-12 focus:outline-none text-gray-700"
            />
            <button 
              type="submit" 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Icon icon="lucide:send" width="20" height="20" />
            </button>
          </form>
        </div>
      </div>

      {/* 右侧辅助信息 */}
      <div className="w-1/3 border-l border-gray-200 px-6 py-4 overflow-auto">
        {/* 背景内容 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">背景内容</h3>
          <div className="text-sm text-gray-700">
            <p className="mb-3">
              南晋长熙年间，大漠赫连部悄然崛起。可汗独女为何身负顾寒草原命运的预言？郡护长子苏飒为何夜夜梦魇？
              平南王独女为何忽然走失忽然带着故事又现现身？赫莱子松的永安公主为何独独心仪一介矮人花匠？
              冷宫中总是被鬼事缠身的双婴恙儿，如何一朝成为了公主近臣？
            </p>
            <p className="mb-3">
              在里中，每一个人都有他们设计好的故事线。皇权斗争？爱恨纠缠？
              时空只是表象，时空谜计里扭曲的情感才是他们的命运。在这里，每一个人都密写入了设定和执念，有些人能够控制这些虚妄的规则，
              有些人迷失在无尽的轮回中。无尽的轮回中，有人像谁着目石向上的西西弗斯。
            </p>
          </div>
        </div>

        {/* 角色设定 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">角色设定</h3>
            <button className="text-blue-500 text-sm flex items-center">
              修改详情
              <Icon icon="lucide:chevron-right" width="16" height="16" className="ml-1" />
            </button>
          </div>
          <div className="text-sm text-gray-700">
            <div className="mb-4">
              <p>1. 赫连英：女，大巫预言的"亡国公主"，熔察为篡原人众望所归的"萝筐之心"，落子果决而冷酷无情，以龙拿之腿弱寇人心，以狠王之勇统御万众，一统北方建立大燕，要江山更要摘星。</p>
            </div>
            <div className="mb-4">
              <p>2. 恙儿：女，从丞相府的千金沦为被庭奴婢，再到权倾一时的女官，命途多舛，历经生死，终以百年减遍的女官之姿，站于权力巅峰；却在世上无人知晓的地方，藏下生平唯一的柔情。</p>
            </div>
          </div>
        </div>

        {/* 分章剧情 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">分章剧情</h3>
            <button className="text-blue-500 text-sm flex items-center">
              修改详情
              <Icon icon="lucide:chevron-right" width="16" height="16" className="ml-1" />
            </button>
          </div>
          <div className="text-sm text-gray-700">
            <div className="mb-2">
              <h4 className="font-medium">第一本：</h4>
              <ol className="list-decimal pl-5 space-y-3 mt-2">
                <li>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxx</li>
                <li>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxx</li>
                <li>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxx</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 