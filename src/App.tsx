import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ScriptProvider } from './context/ScriptContext';
import { CopilotProvider } from './context/CopilotContext';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Knowledge from './pages/Knowledge';

function App() {
  return (
    <ScriptProvider>
      <CopilotProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor/:scriptId?" element={<Editor />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </CopilotProvider>
    </ScriptProvider>
  );
}

export default App;
