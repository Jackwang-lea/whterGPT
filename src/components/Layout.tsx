import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">剧本杀工作台</h1>
        </div>
        <nav className="py-4">
          <ul>
            <li className={`px-4 py-2 ${location.pathname === '/' ? 'bg-blue-50' : 'hover:bg-gray-100'}`}>
              <Link to="/" className="flex items-center text-gray-700">
                <span className="mr-2">📁</span>
                项目管理
              </Link>
            </li>
            <li className={`px-4 py-2 ${location.pathname.includes('/editor') ? 'bg-blue-50' : 'hover:bg-gray-100'}`}>
              <Link to={location.pathname.includes('/editor') ? location.pathname : '/editor'} className="flex items-center text-gray-700">
                <span className="mr-2">📝</span>
                剧本编辑
              </Link>
            </li>
            <li className={`px-4 py-2 ${location.pathname === '/knowledge' ? 'bg-blue-50' : 'hover:bg-gray-100'}`}>
              <Link to="/knowledge" className="flex items-center text-gray-700">
                <span className="mr-2">💡</span>
                知识库
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
} 