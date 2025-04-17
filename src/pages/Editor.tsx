import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScriptContext } from '../context/ScriptContext';
import Layout from '../components/Layout';
import ScriptEditor from '../components/ScriptEditor';
import WorkflowView from '../components/WorkflowView';
import CharacterManager from '../components/CharacterManager';
import SceneManager from '../components/SceneManager';
import DraftGenerator from '../components/DraftGenerator';

export default function Editor() {
  const { scriptId } = useParams<{ scriptId?: string }>();
  const navigate = useNavigate();
  const { currentScript, selectScript } = useScriptContext();

  // Select script if scriptId is provided in URL
  useEffect(() => {
    if (scriptId) {
      selectScript(scriptId);
    }
  }, [scriptId, selectScript]);

  // Redirect to home if no script is selected
  useEffect(() => {
    if (!currentScript && !scriptId) {
      navigate('/');
    }
  }, [currentScript, scriptId, navigate]);

  if (!currentScript) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">正在加载剧本，或者请选择一个剧本...</p>
        </div>
      </Layout>
    );
  }

  // 根据当前工作流步骤渲染对应的编辑器组件
  const renderEditorComponent = () => {
    switch (currentScript.currentStep) {
      case 'outline':
        return <ScriptEditor />;
      case 'characters':
      case 'relationships':
        return <CharacterManager />;
      case 'scenes':
        return <SceneManager />;
      case 'draft':
        return <DraftGenerator />;
      default:
        return <ScriptEditor />;
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <WorkflowView />
        <div className="bg-white shadow rounded-lg h-[calc(100vh-13rem)]">
          {renderEditorComponent()}
        </div>
      </div>
    </Layout>
  );
} 