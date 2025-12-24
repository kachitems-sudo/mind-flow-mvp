import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import InputArea from './components/InputArea';
import FeedItem from './components/FeedItem';
import { FeedItem as FeedItemType } from './types';
import { processUserInput } from './services/geminiService';

const App: React.FC = () => {
  const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Dummy initial welcome message (optional)
  useEffect(() => {
    // Only add if empty (on mount)
    if (feedItems.length === 0) {
       // We could load from local storage here
    }
  }, [feedItems.length]);

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    try {
      const { frontendResponse, data, sources } = await processUserInput(message);
      
      const newItem: FeedItemType = {
        id: Date.now().toString(),
        timestamp: new Date(),
        frontendResponse,
        data,
        sources,
      };

      setFeedItems((prev) => [newItem, ...prev]);
    } catch (error) {
      console.error("Processing failed", error);
      alert("죄송합니다. 처리 중에 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = activeFilter === 'all' || activeFilter === 'insight'
    ? feedItems 
    : feedItems.filter(item => item.data.classification === activeFilter);

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-gray-800 font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <Sidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
           <span className="font-bold text-blue-600">MindFlow</span>
           <span className="text-xs text-gray-400">Ver 2.0</span>
        </div>

        {/* Scrollable Feed Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
            
            {/* Header Text */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">나의 피드</h2>
              <p className="text-gray-500 text-sm">반갑습니다. 오늘 하루의 생각을 정리해볼까요?</p>
            </div>

            {/* Input Section (Sticky-ish or placed at top like social media) */}
            <div className="mb-10 z-20">
              <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>

            {/* Feed List */}
            <div className="space-y-6 pb-20">
              {filteredItems.length === 0 && (
                <div className="text-center py-20 opacity-40">
                   <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-3xl">📝</div>
                   <p>아직 기록이 없습니다.</p>
                   <p className="text-sm">무엇이든 적어보세요, 제가 정리해드릴게요.</p>
                </div>
              )}
              
              {filteredItems.map((item) => (
                <FeedItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;