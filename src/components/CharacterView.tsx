import { Icon } from '@iconify/react';
import { useState } from 'react';

interface CharacterViewProps {
  feedbackText: string;
  handleFeedbackSubmit: (e: React.FormEvent) => void;
  setFeedbackText: (text: string) => void;
}

export default function CharacterView({ feedbackText, handleFeedbackSubmit, setFeedbackText }: CharacterViewProps) {
  const [selectedGender, setSelectedGender] = useState<string>('female');
  const [mbtiType, setMbtiType] = useState<string>('MBTI');
  const [personalityType, setPersonalityType] = useState<string>('ENTJ');
  const [characterType, setCharacterType] = useState<string>('玩家');
  const [characterName, setCharacterName] = useState<string>('');
  // 只保留在JSX中实际使用的变量
  const characterImage = 'xxxxx.jpg'; // 在JSX中使用
  // 以下变量暂时未使用，注释掉以避免警告
  // const emotionPercent = '80%';
  // const selectedCharacter = '角色1';
  // const selectedEmotionType = '事业线';
  // const emotionKeyword = '"只差一步就能永远在一起"';
  const keywords = ['xxxx', 'xxxx']; // 在JSX中使用

  return (
    <div className="flex h-full">
      {/* 左侧区域 - 角色设置，使用flex-col和h-full */}
      <div className="w-2/3 pr-6 border-r border-gray-200 flex flex-col h-full">
        {/* 顶部内容区，可滚动 */}
        <div className="flex-1 overflow-auto">
          {/* 角色选择 */}
          <div className="flex items-start space-x-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center">
                <div>女1</div>
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center">
                <div>女2</div>
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center">
                <div>女3</div>
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center">
                <div>女4</div>
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center">
                <div>男1</div>
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center">
                <div>男2</div>
              </button>
              <button className="w-8 h-8 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center">
                <Icon icon="lucide:plus" width="16" height="16" />
              </button>
            </div>
          </div>

          {/* 性别选择 */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">性别</div>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  name="gender"
                  value="female"
                  checked={selectedGender === 'female'}
                  onChange={() => setSelectedGender('female')}
                />
                <span className="ml-2 text-sm">女</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  name="gender"
                  value="male"
                  checked={selectedGender === 'male'}
                  onChange={() => setSelectedGender('male')}
                />
                <span className="ml-2 text-sm">男</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  name="gender"
                  value="none"
                  checked={selectedGender === 'none'}
                  onChange={() => setSelectedGender('none')}
                />
                <span className="ml-2 text-sm">无性别</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  name="gender"
                  value="both"
                  checked={selectedGender === 'both'}
                  onChange={() => setSelectedGender('both')}
                />
                <span className="ml-2 text-sm">双性别/酷儿</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  name="gender"
                  value="custom"
                  checked={selectedGender === 'custom'}
                  onChange={() => setSelectedGender('custom')}
                />
                <span className="ml-2 text-sm">自定义</span>
              </label>
            </div>
          </div>

          {/* 角色属性 */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">角色人格</div>
              <div className="flex items-center space-x-4">
                <select
                  className="form-select border border-gray-300 rounded px-3 py-2 w-32 text-sm"
                  value={mbtiType}
                  onChange={(e) => setMbtiType(e.target.value)}
                >
                  <option>MBTI</option>
                  <option>INFJ</option>
                  <option>INTJ</option>
                  <option>INFP</option>
                  <option>INTP</option>
                  <option>ENFJ</option>
                  <option>ENTJ</option>
                  <option>ENFP</option>
                  <option>ENTP</option>
                  <option>ISFJ</option>
                  <option>ISTJ</option>
                  <option>ISFP</option>
                  <option>ISTP</option>
                  <option>ESFJ</option>
                  <option>ESTJ</option>
                  <option>ESFP</option>
                  <option>ESTP</option>
                </select>
                <select
                  className="form-select border border-gray-300 rounded px-3 py-2 w-32 text-sm"
                  value={personalityType}
                  onChange={(e) => setPersonalityType(e.target.value)}
                >
                  <option>ENTJ</option>
                  <option>其他选项...</option>
                </select>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">角色类型</div>
              <select
                className="form-select border border-gray-300 rounded px-3 py-2 w-32 text-sm"
                value={characterType}
                onChange={(e) => setCharacterType(e.target.value)}
              >
                <option>玩家</option>
                <option>NPC</option>
                <option>配角</option>
                <option>反派</option>
              </select>
            </div>
          </div>

          {/* 角色名称和形象 */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">角色名称</div>
              <div className="relative">
                <input
                  type="text"
                  className="form-input border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  placeholder="输入框文本"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Icon icon="lucide:rotate-ccw" width="16" height="16" className="text-gray-400" />
                </button>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">角色形象</div>
              <div className="flex items-center space-x-2">
                <div className="form-input border border-gray-300 rounded px-3 py-2 w-full text-sm bg-gray-50">
                  {characterImage}
                </div>
                <button className="border border-gray-300 rounded px-2 py-2">
                  <Icon icon="lucide:upload" width="16" height="16" />
                </button>
              </div>
            </div>
          </div>

          {/* 关键词 */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">关键词</div>
            <div className="relative">
              <div className="form-input border border-gray-300 rounded px-3 py-2 w-full text-sm flex items-center">
                {keywords.map((keyword: string, index: number) => (
                  <span key={index} className="bg-gray-100 rounded px-2 py-1 text-xs mr-2">{keyword}</span>
                ))}
              </div>
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Icon icon="lucide:chevron-down" width="16" height="16" className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* 角色判词 */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">角色判词</div>
            <div className="relative">
              <input
                type="text"
                className="form-input border border-gray-300 rounded px-3 py-2 w-full text-sm"
                placeholder="输入框文本"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Icon icon="lucide:rotate-ccw" width="16" height="16" className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* 情感线 */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">情感线</div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-blue-50 rounded text-sm flex items-center text-blue-600">
                爱情线80%（角色1）：<span className="ml-1 text-xs">"曾经沧海难为水..."</span>
              </div>
              <button className="border border-gray-300 rounded px-2 py-1">
                <Icon icon="lucide:upload" width="16" height="16" />
              </button>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <div className="text-sm">和</div>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white w-24">
                <option>角色1</option>
              </select>
              <div className="text-sm">的</div>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white w-24">
                <option>事业线</option>
              </select>
              <div className="text-sm">占比</div>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white w-24">
                <option>80%</option>
              </select>
              <button className="text-green-600">
                <Icon icon="lucide:check" width="18" height="18" />
              </button>
            </div>
          </div>

          {/* 情感原型 */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">情感原型</div>
            <div className="relative">
              <div className="form-input border border-gray-300 rounded px-3 py-2 w-full text-sm bg-blue-50 text-blue-600">
                "只差一步就能永远在一起"
              </div>
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Icon icon="lucide:chevron-down" width="16" height="16" className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* 人物简介 */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">人物简介</div>
            <textarea
              className="form-textarea border border-gray-300 rounded px-3 py-2 w-full h-24 text-sm"
              placeholder="输入框文本"
            ></textarea>
          </div>
        </div>

        {/* 底部问答区域 - 固定在底部 */}
        <div className="mt-auto mb-4 flex-shrink-0">
          <div className="text-sm font-medium text-gray-700 mb-4">Q: 您是想要这样的角色1的角色设定吗?</div>
          <form onSubmit={handleFeedbackSubmit} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <input
              type="text"
              placeholder="角色不好? 告诉我如何优化，如: xxxxxx"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full focus:outline-none text-gray-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && feedbackText.trim()) {
                  e.preventDefault();
                  handleFeedbackSubmit(e);
                }
              }}
            />
          </form>
        </div>
      </div>

      {/* 右侧区域 - 角色详情，保持不变 */}
      <div className="w-1/3 pl-6 overflow-auto">
        <div className="mb-6 flex flex-col items-center">
          <div className="text-lg font-medium mb-4">角色设定</div>
          <div className="w-32 h-32 rounded-full bg-orange-100 overflow-hidden mb-4 flex items-center justify-center">
            <img src="https://via.placeholder.com/128" alt="Character" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="mb-8">
          <div className="text-base font-medium mb-2">角色设定</div>
          <div className="text-sm">
            1. 赫连英：女，大巫预言的"亡国公主"，熔察为篡原人众望所归的"萝筐之心"，落子果决而冷酷无情，以龙拿之腿弱寇人心，以狠王
            之勇统御万众，一统北方建立大燕，要江山更要摘星。
          </div>
        </div>

        <div className="mb-8">
          <div className="text-base font-medium mb-2">人物小传</div>
          <div className="text-sm">
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxx
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-base font-medium">角色关系</div>
            <button className="text-blue-500 text-sm flex items-center">
              修改详情
              <Icon icon="lucide:chevron-right" width="16" height="16" className="ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="text-sm">
              1. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxx
            </div>
            <div className="text-sm">
              2. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxx
            </div>
            <div className="text-sm">
              3. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              xxxxxxxxxxxx
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 