import React, { useState } from 'react';
import GeminiService from '../services/GeminiService';
import RagService from '../services/RagService';
import { useScriptContext } from '../context/ScriptContext';

interface CharacterInfo {
  name: string;
  basicInfo: string;
}

interface CharacterCandidate {
  title: string;
  content: string;
  id: string;
}

const CharacterCompletion: React.FC = () => {
  // 状态管理
  const [characterInfo, setCharacterInfo] = useState<CharacterInfo>({ 
    name: '', 
    basicInfo: '' 
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [candidates, setCandidates] = useState<CharacterCandidate[]>([]);
  const [selectedContent, setSelectedContent] = useState<{[key: string]: string}>({});
  const [finalResult, setFinalResult] = useState('');
  const [step, setStep] = useState<'input' | 'select' | 'result'>('input');
  
  const { addCharacter } = useScriptContext();
  
  // 候选项生成风格
  const candidateStyles = [
    { id: 'style1', name: '心理深度型', description: '注重心理描写和内心成长' },
    { id: 'style2', name: '关系导向型', description: '侧重社会关系和外部冲突' },
    { id: 'style3', name: '专业能力型', description: '强调独特能力和专业背景' }
  ];
  
  const [selectedStyles, setSelectedStyles] = useState([candidateStyles[0], candidateStyles[1]]);
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCharacterInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // 分析角色信息
  const analyzeCharacterInfo = async (info: CharacterInfo) => {
    try {
      const prompt = `
我需要分析以下角色的基础信息，并判断哪些方面需要补充：

角色名称: ${info.name}
已知信息: ${info.basicInfo}

请分析这个角色的以下方面是否已经明确：
1. 基本信息（年龄、性别、职业）
2. 外貌特征
3. 性格特点
4. 成长背景
5. 目标和动机
6. 能力和特长
7. 弱点和缺陷
8. 与其他角色的关系

对于每个缺失的方面，请提供一个标记，我将用这些标记来指导后续生成。
输出格式为JSON，包含missingAspects数组：
{"missingAspects": ["方面1", "方面2", ...]}
`;
      
      const analysisResult = await GeminiService.generateText(prompt);
      try {
        // 尝试解析为JSON
        const parsed = JSON.parse(analysisResult);
        return parsed.missingAspects || [];
      } catch (e) {
        // 如果解析失败，尝试手动提取
        console.warn('Failed to parse analysis as JSON, attempting manual extraction');
        const aspectsMatch = analysisResult.match(/missingAspects["\s:]+\[(.*?)\]/s);
        if (aspectsMatch && aspectsMatch[1]) {
          return aspectsMatch[1].split(',')
            .map(s => s.replace(/["']/g, '').trim())
            .filter(s => s.length > 0);
        }
        return ["基本信息", "外貌特征", "性格特点", "成长背景", "目标和动机"];
      }
    } catch (error) {
      console.error('Error analyzing character info:', error);
      return ["基本信息", "外貌特征", "性格特点", "成长背景", "目标和动机"];
    }
  };
  
  // 查询相关知识
  const retrieveRelevantKnowledge = async (info: CharacterInfo, missingAspects: string[]) => {
    // 从职业获取背景知识
    const professionMatch = info.basicInfo.match(/职业[：:]\s*([^\n.,，。]+)/);
    const profession = professionMatch ? professionMatch[1].trim() : '';
    
    // 从角色类型获取原型信息
    let retrievedKnowledge = '';
    
    if (profession) {
      // 查询职业相关知识
      const professionalKnowledge = await RagService.answerQuery(
        `${profession} 专业知识 日常工作 行业术语 ${info.name}类型角色`
      );
      retrievedKnowledge += `\n## 职业背景\n${professionalKnowledge}`;
    }
    
    // 查询性格特质相关知识
    if (missingAspects.includes('性格特点')) {
      const personalityTraits = await RagService.answerQuery(
        `剧本角色 常见性格特质 行为表现 言语特征 决策倾向`
      );
      retrievedKnowledge += `\n## 性格参考\n${personalityTraits}`;
    }
    
    return retrievedKnowledge;
  };
  
  // 生成候选项
  const generateCandidates = async () => {
    if (!characterInfo.name || !characterInfo.basicInfo) {
      alert('请输入角色名称和基本信息');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // 1. 分析角色信息
      const missingAspects = await analyzeCharacterInfo(characterInfo);
      
      // 2. 获取相关知识
      const relevantKnowledge = await retrieveRelevantKnowledge(characterInfo, missingAspects);
      
      // 3. 生成候选项
      const prompt = `
请为剧本角色"${characterInfo.name}"生成${selectedStyles.length}个不同风格的完整角色设定。已知的信息如下：

${characterInfo.basicInfo}

基于分析，需要补充的方面包括：${missingAspects.join(', ')}

从知识库中获取的相关参考信息：
${relevantKnowledge}

请生成${selectedStyles.length}个差异化的角色设定，确保它们符合以下条件：
1. 保持与已知信息一致
2. 补充所有缺失的方面
3. 每个候选项应有不同的风格或侧重点
4. 候选项1应更加${selectedStyles[0].description}
5. 候选项2应更加${selectedStyles[1].description}
${selectedStyles.length > 2 ? `6. 候选项3应更加${selectedStyles[2].description}` : ''}

为每个候选项提供一个简短标题，概括其特点。
输出格式如下：

===候选1: [标题]===
[详细内容]

===候选2: [标题]===
[详细内容]

${selectedStyles.length > 2 ? `===候选3: [标题]===
[详细内容]` : ''}
`;
      
      const generatedContent = await GeminiService.generateText(prompt, 0.8, 3000);
      
      // 解析生成的候选项
      const candidateRegex = /===候选(\d+):\s*([^=]+)===\n([\s\S]*?)(?=\n===|$)/g;
      const parsedCandidates: CharacterCandidate[] = [];
      
      let match;
      while ((match = candidateRegex.exec(generatedContent)) !== null) {
        const id = match[1];
        const title = match[2].trim();
        const content = match[3].trim();
        
        parsedCandidates.push({
          id: `candidate${id}`,
          title,
          content
        });
      }
      
      setCandidates(parsedCandidates);
      setStep('select');
    } catch (error) {
      console.error('Error generating candidates:', error);
      alert('生成候选项时出错，请重试');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 选择候选项内容
  const handleContentSelect = (candidateId: string, content: string, selected: boolean) => {
    setSelectedContent(prev => {
      if (selected) {
        return { ...prev, [candidateId]: content };
      } else {
        const newSelection = { ...prev };
        delete newSelection[candidateId];
        return newSelection;
      }
    });
  };
  
  // 合并选中的内容
  const mergeSelectedContent = async () => {
    if (Object.keys(selectedContent).length === 0) {
      alert('请至少选择一个候选项');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const selectionValues = Object.entries(selectedContent)
        .map(([key, value]) => `从候选项${key.replace('candidate', '')}中选择的内容:\n${value}`)
        .join('\n\n');
      
      const prompt = `
用户选择了以下几个候选角色设定中的部分内容，请将它们融合为一个连贯一致的完整角色设定：

原始基础信息：
${characterInfo.basicInfo}

${selectionValues}

请生成一个连贯、一致、自然的角色设定，无缝融合上述内容，并确保角色特点和动机具有内在逻辑性。
`;
      
      const mergedResult = await GeminiService.generateText(prompt, 0.7, 2000);
      setFinalResult(mergedResult);
      setStep('result');
    } catch (error) {
      console.error('Error merging content:', error);
      alert('合并内容时出错，请重试');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 添加到剧本
  const addToScript = () => {
    if (!finalResult) return;
    
    addCharacter({
      name: characterInfo.name,
      description: finalResult.substring(0, 100) + '...',
      background: finalResult
    });
    
    // 重置状态
    setCharacterInfo({ name: '', basicInfo: '' });
    setCandidates([]);
    setSelectedContent({});
    setFinalResult('');
    setStep('input');
    
    alert('角色已添加到剧本');
  };
  
  // 渲染候选项对照视图
  const renderCandidateComparison = () => {
    if (candidates.length === 0) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        {candidates.map(candidate => (
          <div key={candidate.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-medium mb-2 text-blue-600">{candidate.title}</h3>
            <div className="h-64 overflow-y-auto mb-4 text-sm">
              <p className="whitespace-pre-line">{candidate.content}</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 text-xs rounded-full ${
                  selectedContent[candidate.id] ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}
                onClick={() => handleContentSelect(candidate.id, candidate.content, !selectedContent[candidate.id])}
              >
                {selectedContent[candidate.id] ? '已选择' : '选择整个内容'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">角色设定补全</h2>
      
      {step === 'input' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">角色名称</label>
            <input
              type="text"
              name="name"
              value={characterInfo.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入角色名称"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">基本信息</label>
            <textarea
              name="basicInfo"
              value={characterInfo.basicInfo}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入已知的角色信息，如年龄、职业、外貌特征等..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择生成风格（最多3个）</label>
            <div className="flex flex-wrap gap-2">
              {candidateStyles.map(style => (
                <button
                  key={style.id}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    selectedStyles.some(s => s.id === style.id)
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    if (selectedStyles.some(s => s.id === style.id)) {
                      setSelectedStyles(selectedStyles.filter(s => s.id !== style.id));
                    } else if (selectedStyles.length < 3) {
                      setSelectedStyles([...selectedStyles, style]);
                    }
                  }}
                >
                  {style.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {selectedStyles.map(s => s.name).join('、')}
            </p>
          </div>
          
          <button
            onClick={generateCandidates}
            disabled={isGenerating || !characterInfo.name || !characterInfo.basicInfo}
            className={`w-full py-2 rounded-md font-medium transition-all duration-200 ${
              isGenerating || !characterInfo.name || !characterInfo.basicInfo
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            {isGenerating ? '生成中...' : '生成角色设定候选项'}
          </button>
        </div>
      )}
      
      {step === 'select' && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">角色: {characterInfo.name}</h3>
            <p className="text-sm text-gray-600 mb-4">请从以下候选项中选择您喜欢的内容，可以选择多个</p>
            {renderCandidateComparison()}
            
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep('input')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                返回编辑
              </button>
              
              <button
                onClick={mergeSelectedContent}
                disabled={isGenerating || Object.keys(selectedContent).length === 0}
                className={`px-4 py-2 rounded-md ${
                  isGenerating || Object.keys(selectedContent).length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isGenerating ? '处理中...' : '合并选中内容'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {step === 'result' && (
        <div>
          <h3 className="text-lg font-medium mb-2">最终角色设定</h3>
          <div className="border rounded-lg p-4 bg-white mb-4 max-h-96 overflow-y-auto">
            <h4 className="font-bold mb-2">{characterInfo.name}</h4>
            <p className="whitespace-pre-line">{finalResult}</p>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setStep('select')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              返回选择
            </button>
            
            <button
              onClick={addToScript}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              添加到剧本
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterCompletion; 