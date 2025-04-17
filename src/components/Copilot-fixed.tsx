// 一个非常简单的Copilot组件，用于测试是否可以正确显示
import { useState } from 'react';

// 这个日志会在导入组件时打印
console.log('正在加载简化版Copilot组件');

export default function SimpleCopilot() {
  // 这个日志会在每次渲染组件时打印
  console.log('渲染简化版Copilot组件');
  
  // 非常简单的状态
  const [isVisible, setIsVisible] = useState(true);
  
  // 切换可见性
  const toggleVisibility = () => {
    console.log('切换显示状态，当前: ', isVisible);
    setIsVisible(!isVisible);
  };
  
  console.log('Copilot渲染状态: ', { isVisible });
  
  return (
    <>
      {/* 永久固定的切换按钮 */}
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: isVisible ? '#3b82f6' : '#4f46e5',
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          cursor: 'pointer'
        }}
        onClick={toggleVisibility}
      >
        🤖
      </div>
      
      {/* 主Copilot界面 */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            width: '350px',
            height: '450px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            zIndex: 9000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>Copilot 创作助手</span>
            <span style={{ cursor: 'pointer' }} onClick={toggleVisibility}>✕</span>
          </div>
          
          <div style={{ padding: '16px', flex: 1, backgroundColor: '#f9fafb', overflow: 'auto' }}>
            <p style={{ textAlign: 'center', margin: '20px 0', color: '#6b7280' }}>
              简化版Copilot已显示
            </p>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
              这是用于测试显示问题的简化版本
            </p>
          </div>
          
          <div style={{ 
            borderTop: '1px solid #e5e7eb', 
            padding: '12px', 
            display: 'flex' 
          }}>
            <input 
              type="text" 
              placeholder="输入你的问题..." 
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px 0 0 4px',
                outline: 'none'
              }}
            />
            <button 
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                padding: '0 16px',
                cursor: 'pointer'
              }}
            >
              发送
            </button>
          </div>
        </div>
      )}
    </>
  );
}
