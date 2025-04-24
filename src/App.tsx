// App组件
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ScriptProvider } from './context/ScriptContext';
// 暂时注释掉以避免API错误
// import { CopilotProvider } from './context/CopilotContext';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Knowledge from './pages/Knowledge';

function App() {
  return (
    <ScriptProvider>
      {/* 暂时移除CopilotProvider以避免API错误 */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:scriptId?" element={<Editor />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ScriptProvider>
  );
}

export default App;
