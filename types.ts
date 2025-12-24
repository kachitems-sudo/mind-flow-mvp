import React from 'react';

export type NoteClassification = 'Task' | 'Idea' | 'Journal' | 'Resource' | 'Memo';

export interface ActionItem {
  task: string;
  is_done: boolean;
}

export interface MindFlowData {
  classification: NoteClassification;
  title: string;
  summary: string;
  original_content: string;
  tags: string[];
  mood_score: number;
  ai_comment: string;
  action_items: ActionItem[];
  related_context: string;
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface FeedItem {
  id: string;
  timestamp: Date;
  frontendResponse: string; // The "Part 1" friendly text
  data: MindFlowData; // The "Part 2" JSON data
  sources?: WebSource[]; // Grounding sources from Google Search
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}