import React from 'react';
import { LayoutGrid, BarChart2, CheckSquare, Lightbulb, BookOpen, Link as LinkIcon, FileText } from 'lucide-react';

interface SidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeFilter, onFilterChange }) => {
  const menuItems = [
    { id: 'all', label: '모든 기록', icon: <LayoutGrid size={18} /> },
    { id: 'insight', label: '인사이트', icon: <BarChart2 size={18} /> },
    { id: 'Task', label: '할 일', icon: <CheckSquare size={18} /> },
    { id: 'Idea', label: '아이디어', icon: <Lightbulb size={18} /> },
    { id: 'Journal', label: '일기', icon: <BookOpen size={18} /> },
    { id: 'Resource', label: '자료실', icon: <LinkIcon size={18} /> },
    { id: 'Memo', label: '메모', icon: <FileText size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col h-full hidden md:flex font-sans">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">MindFlow</h1>
        <p className="text-xs text-gray-400 mt-1 font-medium">Ver 2.0 • 인지적 동반자</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onFilterChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === item.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs font-bold text-blue-600 mb-1">상태</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-600 font-medium">준비 완료</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
