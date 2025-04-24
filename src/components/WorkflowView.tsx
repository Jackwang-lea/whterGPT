import { useState } from 'react';
import { useScriptContext } from '../context/ScriptContext';
import { WorkflowStep } from '../types';

export default function WorkflowView() {
  const { currentScript, updateScript } = useScriptContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [targetStep, setTargetStep] = useState<WorkflowStep | null>(null);
  const [stepWarning, setStepWarning] = useState<string | null>(null);
  
  if (!currentScript) {
    return null;
  }

  const steps: { id: WorkflowStep; label: string; icon: string; requiresPrevious: boolean; validator: () => boolean; warningMessage: string }[] = [
    { 
      id: 'outline', 
      label: '大纲', 
      icon: '📝',
      requiresPrevious: false,
      validator: () => true, // 大纲作为第一步，没有前置条件
      warningMessage: '' 
    },
    { 
      id: 'characters', 
      label: '人物设定', 
      icon: '👤',
      requiresPrevious: true,
      validator: () => (currentScript.outline || '').length > 50, // 要求大纲至少有一定内容
      warningMessage: '请先完善剧本大纲（至少50个字符）' 
    },
    { 
      id: 'relationships', 
      label: '角色关系', 
      icon: '🔄',
      requiresPrevious: true,
      validator: () => (currentScript.characters || []).length >= 2, // 至少需要2个角色才能建立关系
      warningMessage: '请先创建至少2个角色' 
    },
    { 
      id: 'scenes', 
      label: '分幕', 
      icon: '🎬',
      requiresPrevious: true,
      validator: () => {
        // 检查是否至少有一个角色关系
        return (currentScript.characters || []).some((character: any) => character.relationships.length > 0);
      },
      warningMessage: '请先定义至少一个角色关系' 
    },
    { 
      id: 'draft', 
      label: '初稿', 
      icon: '📄',
      requiresPrevious: true,
      validator: () => (currentScript.scenes || []).length > 0, // 至少需要一个场景
      warningMessage: '请先创建至少一个场景' 
    },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentScript.currentStep);
  
  // 根据当前内容生成下一步的内容
  const generateNextStepContent = (targetStepId: WorkflowStep) => {
    const currentStepId = currentScript.currentStep;
    
    // 始终保存当前内容，确保切换步骤时不会丢失
    const updatedScript = { ...currentScript };
    
    // 如果从大纲到人物设定，基于大纲提取可能的角色
    if (currentStepId === 'outline' && targetStepId === 'characters') {
      // 这里简单实现从大纲中提取@标记的角色名
      const characterMatches = currentScript.outline.match(/@(\w+)/g) || [];
      const extractedCharacters = characterMatches.map(match => ({
        name: match.substring(1), // 去掉@符号
        description: `从大纲中提取的角色：${match.substring(1)}`,
        background: '',
        id: crypto.randomUUID(),
        relationships: []
      }));
      
      // 如果有提取到角色且当前没有角色，就添加到脚本中
      if (extractedCharacters.length > 0 && (currentScript.characters || []).length === 0) {
        updatedScript.characters = extractedCharacters;
        updatedScript.currentStep = targetStepId;
        updateScript(updatedScript);
        return true;
      }
    }
    
    // 如果从人物设定到角色关系，但还没有关系定义
    if (currentStepId === 'characters' && targetStepId === 'relationships') {
      // 检查是否所有角色都没有关系
      const noRelationshipsDefined = (currentScript.characters || []).every((char: any) => 
        char.relationships.length === 0
      );
      
      if (noRelationshipsDefined && (currentScript.characters || []).length >= 2) {
        // 为简单起见，这里只是为第一个角色添加与第二个角色的关系
        const updatedCharacters = [...(currentScript.characters || [])];
        if (updatedCharacters.length >= 2) {
          updatedCharacters[0] = {
            ...updatedCharacters[0],
            relationships: [
              ...updatedCharacters[0].relationships,
              {
                target: updatedCharacters[1].id,
                source: updatedCharacters[0].id,
                type: '未知关系',
                description: '请在此描述角色关系'
              }
            ]
          };
          
          updatedScript.characters = updatedCharacters;
          updatedScript.currentStep = targetStepId;
          updateScript(updatedScript);
          return true;
        }
      }
    }
    
    // 如果从角色关系到分幕，但还没有场景
    if (currentStepId === 'relationships' && targetStepId === 'scenes' && (currentScript.scenes || []).length === 0) {
      // 创建一个基础场景
      const newScene = {
        id: crypto.randomUUID(),
        title: '第一幕',
        description: '基于角色关系的初始场景',
        characters: (currentScript.characters || []).map((char: any) => char.id), // 包含所有角色
        content: '在此编写场景内容',
        order: 0
      };
      
      updatedScript.scenes = [newScene];
      updatedScript.currentStep = targetStepId;
      updateScript(updatedScript);
      return true;
    }
    
    // 如果从分幕到初稿，但初稿为空
    if (currentStepId === 'scenes' && targetStepId === 'draft') {
      // 基于现有场景生成初稿框架
      const draftSections = (currentScript.scenes || [])
        .sort((a: any, b: any) => a.order - b.order)
        .map((scene: any) => 
          `## ${scene.title}\n\n${scene.description}\n\n参与角色：${
            scene.characters.map((charId: string) => {
              const character = (currentScript.characters || []).find((c: any) => c.id === charId);
              return character ? character.name : '未知角色';
            }).join('、')
          }\n\n${scene.content}\n\n---\n\n`
        ).join('');
      
      const fullDraft = `# ${currentScript.title} - 初稿\n\n${draftSections}`;
      
      // 更新脚本内容
      updatedScript.outline = fullDraft;
      updatedScript.currentStep = targetStepId;
      updateScript(updatedScript);
      return true;
    }
    
    // 默认更新步骤状态
    updatedScript.currentStep = targetStepId;
    updateScript(updatedScript);
    return false;
  };

  const handleStepClick = (stepId: WorkflowStep, stepIndex: number) => {
    // 如果点击当前步骤，不做任何操作
    if (stepId === currentScript.currentStep) {
      return;
    }
    
    const step = steps.find(s => s.id === stepId);
    
    // 向后跳转：检查是否满足条件
    if (stepIndex > currentStepIndex) {
      // 检查是否需要按顺序完成
      if (step?.requiresPrevious && stepIndex > currentStepIndex + 1) {
        setStepWarning('请按照工作流顺序完成每个步骤');
        setTimeout(() => setStepWarning(null), 3000);
        return;
      }
      
      // 检查当前步骤是否满足前置条件
      if (!step?.validator()) {
        setStepWarning(step?.warningMessage || '请先完成当前步骤的必要内容');
        setTimeout(() => setStepWarning(null), 3000);
        return;
      }
      
      // 询问是否要生成下一步内容
      setTargetStep(stepId);
      setShowConfirmDialog(true);
      return;
    }
    
    // 向前跳转：警告可能丢失数据
    setTargetStep(stepId);
    setShowConfirmDialog(true);
  };

  const confirmStepChange = () => {
    if (!targetStep) return;
    
    generateNextStepContent(targetStep);
    setShowConfirmDialog(false);
    setTargetStep(null);
  };

  const cancelStepChange = () => {
    setShowConfirmDialog(false);
    setTargetStep(null);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6 relative">
      {stepWarning && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-t-lg text-center animate-fadeIn">
          {stepWarning}
        </div>
      )}
      
      <h2 className="text-lg font-semibold text-gray-800 mb-4">创作工作流</h2>
      
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 z-0" />
        
        {/* Steps */}
        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const isActive = currentStepIndex === index;
            const isCompleted = currentStepIndex > index;
            const isDisabled = index > currentStepIndex + 1;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* 使用水平布局 */}
                <button
                  onClick={() => handleStepClick(step.id, index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isDisabled
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                  disabled={isDisabled}
                >
                  {step.icon}
                </button>
                <span 
                  className={`text-sm ${isActive ? 'font-medium text-blue-600' : isDisabled ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Guidance */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <h3 className="font-medium text-gray-800 mb-1">
          当前步骤: {steps[currentStepIndex].label}
        </h3>
        <p className="text-sm text-gray-600">
          {currentScript.currentStep === 'outline' && '创建剧本大纲，确定主要故事架构和叙事走向。提示：使用@角色名可以标记角色，有助于下一步自动提取角色。'}
          {currentScript.currentStep === 'characters' && '设计主要角色，包括背景、动机和性格特点。确保添加至少两个角色以便建立关系网络。'}
          {currentScript.currentStep === 'relationships' && '定义角色之间的关系网络和互动方式。这些关系将影响后续剧情的发展和冲突设置。'}
          {currentScript.currentStep === 'scenes' && '将故事划分为多个场景，确定每个场景的角色和事件。根据角色关系设计有意义的互动和冲突。'}
          {currentScript.currentStep === 'draft' && '撰写完整剧本初稿，融合前面步骤中的所有元素。此处内容将作为最终成果，可随时回到前面步骤修改细节。'}
        </p>
      </div>
      
      {/* Step Change Confirmation Dialog */}
      {showConfirmDialog && targetStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-3">切换创作步骤</h3>
            
            <p className="mb-4 text-gray-600">
              {currentStepIndex < steps.findIndex(s => s.id === targetStep)
                ? '是否要进入下一个创作步骤？系统将尝试基于当前内容自动生成草稿。'
                : '警告：回到前一步可能会影响已创建的后续内容。确定要返回吗？'}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelStepChange}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={confirmStepChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 