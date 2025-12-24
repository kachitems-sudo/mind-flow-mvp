import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    await onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all relative">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="무슨 생각을 하고 계신가요? (링크, 잡담, 할 일 등 자유롭게 적어주세요)"
        className="w-full p-4 pr-12 text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none resize-none min-h-[80px] text-base"
        disabled={isLoading}
      />
      
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
         {isLoading && (
            <div className="text-xs text-blue-500 flex items-center gap-1 animate-pulse font-medium">
                <Sparkles size={14} />
                <span>MindFlow 2.0 처리 중...</span>
            </div>
         )}
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className={`p-2 rounded-full transition-colors ${
            input.trim() && !isLoading
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
        </button>
      </div>

      <div className="absolute bottom-3 left-4 text-[10px] text-gray-300 select-none">
          Enter로 전송, Shift+Enter로 줄바꿈
      </div>
    </div>
  );
};

export default InputArea;
