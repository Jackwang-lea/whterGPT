import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScriptContext } from '../context/ScriptContext';
import Layout from '../components/Layout';
import ScriptEditor from '../components/ScriptEditor';
import WorkflowView from '../components/WorkflowView';
import Copilot from '../components/Copilot';

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

  return (
    <Layout>
      <div className="p-6">
        <WorkflowView />
        <div className="bg-white shadow rounded-lg h-[calc(100vh-13rem)]">
          <ScriptEditor />
        </div>
      </div>
      <Copilot />
    </Layout>
  );
} 