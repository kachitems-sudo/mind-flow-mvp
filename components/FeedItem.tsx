import React, { useState } from 'react';
import { CheckSquare, Lightbulb, BookOpen, Link as LinkIcon, FileText, MoreHorizontal, Tag, Calendar, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { FeedItem as FeedItemType, NoteClassification } from '../types';

interface FeedItemProps {
  item: FeedItemType;
}

const getClassColor = (classification: NoteClassification) => {
  switch (classification) {
    case 'Task': return 'text-red-500 bg-red-50 border-red-100';
    case 'Idea': return 'text-amber-500 bg-amber-50 border-amber-100';
    case 'Journal': return 'text-purple-500 bg-purple-50 border-purple-100';
    case 'Resource': return 'text-blue-500 bg-blue-50 border-blue-100';
    case 'Memo': return 'text-gray-500 bg-gray-50 border-gray-100';
    default: return 'text-gray-500 bg-gray-50';
  }
};

const getClassIcon = (classification: NoteClassification) => {
  switch (classification) {
    case 'Task': return <CheckSquare size={16} />;
    case 'Idea': return <Lightbulb size={16} />;
    case 'Journal': return <BookOpen size={16} />;
    case 'Resource': return <LinkIcon size={16} />;
    case 'Memo': return <FileText size={16} />;
    default: return <FileText size={16} />;
  }
};

const FeedItem: React.FC<FeedItemProps> = ({ item }) => {
  const { data, frontendResponse, timestamp, sources } = item;
  const [showJson, setShowJson] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(timestamp);

  const colorClass = getClassColor(data.classification);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6 transition-all hover:shadow-md">
      {/* AI Persona Header (Simulating the friendly chat part) */}
      <div className={`px-6 py-4 border-b border-dashed ${data.classification === 'Task' ? 'border-red-100 bg-red-50/30' : 'border-gray-100'}`}>
        <div className="flex items-start gap-3">
          <div className={`mt-1 p-2 rounded-lg ${colorClass} flex-shrink-0`}>
            {getClassIcon(data.classification)}
          </div>
          <div className="flex-1">
             <div className="flex justify-between items-start">
                 <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${colorClass.split(' ')[0]}`}>
                    {data.classification}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                </button>
             </div>
            <p className="text-gray-700 text-sm font-medium italic leading-relaxed">
              "{data.ai_comment}"
            </p>
          </div>
        </div>
      </div>

      {/* Structured Content */}
      <div className="p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{data.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {data.summary}
        </p>

        {/* Action Items */}
        {data.action_items && data.action_items.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">실행 계획</h4>
            <ul className="space-y-2">
              {data.action_items.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    checked={action.is_done} 
                    readOnly
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{action.task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Sources Section */}
        {sources && sources.length > 0 && (
          <div className="bg-blue-50/50 rounded-lg p-3 mb-4 border border-blue-100">
             <div className="flex items-center gap-1.5 mb-2">
                <Globe size={12} className="text-blue-500" />
                <span className="text-xs font-bold text-blue-600 uppercase">참고 출처</span>
             </div>
             <div className="space-y-1">
                {sources.map((source, idx) => (
                   <a 
                     key={idx} 
                     href={source.uri} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="block text-xs text-gray-600 hover:text-blue-600 hover:underline truncate transition-colors"
                   >
                     {source.title || source.uri}
                   </a>
                ))}
             </div>
          </div>
        )}

        {/* Tags & Context */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {data.tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <Tag size={12} />
              {tag}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
             감정: {data.mood_score}/10
          </span>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
          
          <button 
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 font-medium"
          >
            <span>JSON 데이터</span>
            {showJson ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* JSON View (Collapsible) */}
      {showJson && (
        <div className="bg-gray-900 p-4 overflow-x-auto border-t border-gray-800">
          <pre className="text-xs text-green-400 font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FeedItem;