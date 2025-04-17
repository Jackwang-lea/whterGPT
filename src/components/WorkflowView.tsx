import { useScriptContext } from '../context/ScriptContext';
import { WorkflowStep } from '../types';

export default function WorkflowView() {
  const { currentScript, setWorkflowStep } = useScriptContext();

  if (!currentScript) {
    return null;
  }

  const steps: { id: WorkflowStep; label: string; icon: string }[] = [
    { id: 'outline', label: '大纲', icon: '📝' },
    { id: 'characters', label: '人物设定', icon: '👤' },
    { id: 'relationships', label: '角色关系', icon: '🔄' },
    { id: 'scenes', label: '分幕', icon: '🎬' },
    { id: 'draft', label: '初稿', icon: '📄' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentScript.currentStep);

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">创作工作流</h2>
      
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 z-0" />
        
        {/* Steps */}
        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const isActive = currentStepIndex === index;
            const isCompleted = currentStepIndex > index;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  onClick={() => setWorkflowStep(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'}`}
                >
                  {step.icon}
                </button>
                <span 
                  className={`text-sm ${isActive ? 'font-medium text-blue-600' : 'text-gray-500'}`}
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
          {currentScript.currentStep === 'outline' && '创建剧本大纲，确定主要故事架构和叙事走向。'}
          {currentScript.currentStep === 'characters' && '设计主要角色，包括背景、动机和性格特点。'}
          {currentScript.currentStep === 'relationships' && '定义角色之间的关系网络和互动方式。'}
          {currentScript.currentStep === 'scenes' && '将故事划分为多个场景，确定每个场景的角色和事件。'}
          {currentScript.currentStep === 'draft' && '撰写完整剧本初稿，融合前面步骤中的所有元素。'}
        </p>
      </div>
    </div>
  );
} 